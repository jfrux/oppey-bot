const { SettingProvider } = require('discord.js-commando');
const path = require("path");
const fetch = require("node-fetch");
const Sequelize = require('sequelize');
/**
 * Uses an PostgreSQL database to store settings with guilds
 * @extends {SettingProvider}
 */
class SequelizeProvider extends SettingProvider {
	/**
	 * @external PostgreSQLDatabase
	 * @see {@link https://www.npmjs.com/package/sequelize}
	 */

	/**
	 * @param {SQLDatabase} db - Database for the provider
	 */
	constructor(db) {
    console.log("[SequelizeProvider] Constructor...");
		super();
		/**
		 * Database that will be used for storing/retrieving settings
		 * @type {SQLDatabase}
		 */
		this.db = db;

    console.log("[SequelizeProvider] Set db...",db.config.database);
		/**
		 * Client that the provider is for (set once the client is ready, after using {@link CommandoClient#setProvider})
		 * @name SequelizeProvider#client
		 * @type {CommandoClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: null, writable: true });

		/**
		 * Settings cached in memory, mapped by guild ID (or 'global')
		 * @type {Map}
		 * @private
		 */
		this.settings = new Map();

    console.log("[SequelizeProvider] Set settings to",this.settings);
		/**
		 * Listeners on the Client, mapped by the event name
		 * @type {Map}
		 * @private
		 */
		this.listeners = new Map();
    console.log("[SequelizeProvider] Set listeners to",this.listeners);

		/**
		 * Sequelize Model Object
		 * @type {SequelizeModel}
		 * @private
		 */
		this.model = this.db.define('discord_settings', {
			guild: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				primaryKey: true
			},
			settings: { type: Sequelize.JSONB }
    },
    {
      underscored: true
    });
    console.log("[SequelizeProvider] Set model");
    
		/**
		 * @external SequelizeModel
		 * @see {@link http://docs.sequelizejs.com/en/latest/api/model/}
		 */
	}

	async init(client) {
    this.client = client;
    console.log("[SequelizeProvider] Init provider with client...")
    // fetch makes
    
    console.log("[SequelizeProvider] Syncing settings model...");
		await this.model.sync({force: false})
    console.log("[SequelizeProvider] Synced settings model.");

    // Load all settings
    let oppeyGuilds = client.guilds.map(g => g.id);
    console.log("Oppey Guild:", oppeyGuilds);
    
    // guilds = guilds.map(guild => guild.guild);

    /*
    * Add guilds to the DB which was added client when it was offline.
    */
    
    console.log("[SequelizeProvider] Loading existing settings...");
		const rows = await client.database.models.discord_settings.findAll();
		

		for (const [event, listener] of this.listeners) client.on(event, listener);
	}

	destroy() {
		// Remove all listeners from the client
		for (const [event, listener] of this.listeners) this.client.removeListener(event, listener);
		this.listeners.clear();
	}

	get(guild, key, defVal) {
		const settings = this.settings.get(this.constructor.getGuildID(guild));
		return settings ? typeof settings[key] !== 'undefined' ? settings[key] : defVal : defVal;
	}

	async set(guild, key, val) {
    console.log(`[SequelizeProvider] Settings '${key}' to '${value}'...`)
		guild = this.constructor.getGuildID(guild);
		let settings = this.settings.get(guild);
		if (!settings) {
			settings = {};
			this.settings.set(guild, settings);
		}

		settings[key] = val;
		await this.model.upsert(
			{ guild: guild !== 'global' ? guild : '0', settings: JSON.stringify(settings) },
			{ where: { guild: guild !== 'global' ? guild : '0' } }
		);
    if (guild === 'global') this.updateOtherShards(key, val);
    console.log(`[SequelizeProvider] Set '${key}' to '${value}' complete.`)
		return val;
	}

	async remove(guild, key) {
		guild = this.constructor.getGuildID(guild);
		const settings = this.settings.get(guild);
		if (!settings || typeof settings[key] === 'undefined') return undefined;

		const val = settings[key];
		settings[key] = undefined;
		await this.model.upsert(
			{ guild: guild !== 'global' ? guild : '0', settings: JSON.stringify(settings) },
			{ where: { guild: guild !== 'global' ? guild : '0' } }
		);
		if (guild === 'global') this.updateOtherShards(key, undefined);
		return val;
	}

	async clear(guild) {
		guild = this.constructor.getGuildID(guild);
		if (!this.settings.has(guild)) return;
		this.settings.delete(guild);
		await this.model.destroy({ where: { guild: guild !== 'global' ? guild : '0' } });
	}

	/**
	 * Loads all settings for a guild
	 * @param {string} guild - Guild ID to load the settings of (or 'global')
	 * @param {Object} settings - Settings to load
	 * @private
	 */
	setupGuild(guild, settings) {
		if (typeof guild !== 'string') throw new TypeError('The guild must be a guild ID or "global".');
		guild = this.client.guilds.get(guild) || null;
    console.log("[SequelizeProvider] Setting up guild...", guild)
		// Load the command prefix
		if (typeof this.client.commandPrefix !== 'undefined') {
			if (guild) guild._commandPrefix = this.client.commandPrefix;
		}

		// Load all command/group statuses
		for (const command of this.client.registry.commands.values()) this.setupGuildCommand(guild, command, settings);
		for (const group of this.client.registry.groups.values()) this.setupGuildGroup(guild, group, settings);
	}

	/**
	 * Sets up a command's status in a guild from the guild's settings
	 * @param {?Guild} guild - Guild to set the status in
	 * @param {Command} command - Command to set the status of
	 * @param {Object} settings - Settings of the guild
	 * @private
	 */
	setupGuildCommand(guild, command, settings) {
		if (typeof settings[`cmd-${command.name}`] === 'undefined') return;
		if (guild) {
			if (!guild._commandsEnabled) guild._commandsEnabled = {};
			guild._commandsEnabled[command.name] = settings[`cmd-${command.name}`];
		} else {
			command._globalEnabled = settings[`cmd-${command.name}`];
		}
	}

	/**
	 * Sets up a group's status in a guild from the guild's settings
	 * @param {?Guild} guild - Guild to set the status in
	 * @param {CommandGroup} group - Group to set the status of
	 * @param {Object} settings - Settings of the guild
	 * @private
	 */
	setupGuildGroup(guild, group, settings) {
		if (typeof settings[`grp-${group.id}`] === 'undefined') return;
		if (guild) {
			if (!guild._groupsEnabled) guild._groupsEnabled = {};
			guild._groupsEnabled[group.id] = settings[`grp-${group.id}`];
		} else {
			group._globalEnabled = settings[`grp-${group.id}`];
		}
	}

	/**
	 * Updates a global setting on all other shards if using the {@link ShardingManager}.
	 * @param {string} key - Key of the setting to update
	 * @param {*} val - Value of the setting
	 * @private
	 */
	updateOtherShards(key, val) {
		if (!this.client.shard) return;
		key = JSON.stringify(key);
		val = typeof val !== 'undefined' ? JSON.stringify(val) : 'undefined';
		this.client.shard.broadcastEval(`
			if(this.shard.id !== ${this.client.shard.id} && this.provider && this.provider.settings) {
				this.provider.settings.global[${key}] = ${val};
			}
		`);
	}
}

module.exports = SequelizeProvider;