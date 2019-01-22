const fs = require('fs');
const Sequelize = require("sequelize");
const { DATABASE_URL } = process.env;

module.exports = (client) => {
  // Models
  const database = client.database;
  
  const User = database.define('discord_user', {
    userid: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    avatar: {
      type: Sequelize.STRING(2048)
    },
    username: {
      type: Sequelize.STRING
    },
    info: {
      type: Sequelize.BLOB
    },
    location: {
      type: Sequelize.STRING
    },
    afk: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    afkmessage: {
      type: Sequelize.BLOB
    },
    blacklisted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    underscored: true
  });
  
  const Vehicle = database.define('discord_user_vehicle', {
    userid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    vehicle_config_id: {
      type: Sequelize.INTEGER
    },
    year: {
      type: Sequelize.INTEGER
    },
    make: {
      type: Sequelize.STRING
    },
    model: {
      type: Sequelize.STRING
    },
    trim: {
      type: Sequelize.STRING
    }
  }, {
    underscored: true
  });
  const VehicleConfig = database.define('vehicle_config', {
    title: {
      type: Sequelize.STRING
    },
    year: {
      type: Sequelize.INTEGER
    },
    vehicle_make_id: {
      type: Sequelize.BIGINT
    },
    vehicle_model_id: {
      type: Sequelize.BIGINT
    },
    vehicle_trim_id: {
      type: Sequelize.BIGINT
    },
    vehicle_config_status_id: {
      type: Sequelize.BIGINT
    },
    description: {
      type: Sequelize.TEXT
    },
    vehicle_make_package_id: {
      type: Sequelize.BIGINT
    },
    slug: {
      type: Sequelize.STRING
    },
    vehicle_config_type_id: {
      type: Sequelize.BIGINT
    },
    parent_id: {
      type: Sequelize.INTEGER
    },
    lft: {
      type: Sequelize.INTEGER
    },
    rgt: {
      type: Sequelize.INTEGER
    },
    depth: {
      type: Sequelize.INTEGER
    },
    children_count: {
      type: Sequelize.INTEGER
    },
    year_end: {
      type: Sequelize.INTEGER
    },
    trim_styles_count: {
      type: Sequelize.INTEGER
    },
    refreshing: {
      type: Sequelize.BOOLEAN
    },
    cached_votes_total: {
      type: Sequelize.INTEGER
    },
    cached_votes_score: {
      type: Sequelize.INTEGER
    },
    cached_votes_up: {
      type: Sequelize.INTEGER
    },
    cached_votes_down: {
      type: Sequelize.INTEGER
    },
    cached_weighted_score: {
      type: Sequelize.INTEGER
    },
    cached_weighted_total: {
      type: Sequelize.INTEGER
    },
    cached_weighted_average: {
      type: Sequelize.DOUBLE
    },
    primary_repository_id: {
      type: Sequelize.INTEGER
    },
    primary_pull_request_id: {
      type: Sequelize.INTEGER
    },
    source_image_url: {
      type: Sequelize.STRING
    },
    user_count: {
      type: Sequelize.INTEGER
    },
    views_count: {
      type: Sequelize.INTEGER
    },
    followers_count: {
      type: Sequelize.INTEGER
    },
    thredded_messageboard_id: {
      type: Sequelize.BIGINT
    }
  }, {
    underscored: true
  });
  User.Vehicles = User.hasMany(Vehicle, {
    as: "Vehicles",
    foreignKey: 'userid',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  // Associations
  // Guild.Items = Guild.hasMany(Items, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.ModerationCases = Guild.hasMany(ModerationCase, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Roles = Guild.hasMany(Role, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.ScheduledCommands = Guild.hasMany(ScheduledCommand, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Shop = Guild.hasOne(Shop, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Events = Guild.hasMany(Event, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Streamers = Guild.hasOne(Streamers, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.TextChannels = Guild.hasMany(TextChannel, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Transactions = Guild.hasMany(Transaction, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Triggers = Guild.hasMany(Trigger, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.Playlist = Guild.hasMany(Playlist, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  // Guild.ReactionRolesGroup = Guild.hasMany(ReactionRolesGroup, {
  //   foreignKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });
  
  // User.Transactions = User.hasMany(Transaction, {
  //   foreignKey: 'userid',
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'CASCADE'
  // });
  // User.Guild = User.belongsToMany(Guild, {
  //   through: 'guildmember',
  //   foreignKey: 'userid',
  //   otherKey: 'guildid',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE'
  // });

  // Save (sync) models to database.
  // database.sync({
  //   force: true
  // });
  User.sync({force: true});
  Vehicle.sync({force: true});

  // Return models
  return database.models;
};