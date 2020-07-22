const moment = require('moment');

const model = (DataTypes) => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  major_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'majors',
      key: 'id'
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nim: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  class_of: {
    type: DataTypes.INTEGER(4),
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  birthplace: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  bandung_address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  origin_address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  line_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  instagram: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_alumni: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  created_at: {
      type: DataTypes.DATE,
      allowNull: true
  },
  updated_at: {
      type: DataTypes.DATE,
      allowNull: true
  },
  deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
  }
});

const options = {
  tableName: 'members',
  freezeTableName: true,
  underscored: true,
  paranoid: true /** Soft deletes */
};

module.exports = {
  options,
  model,
  default: function (sequelize, dataTypes) {
      const Member = sequelize.define( 'Member', model(dataTypes), options);

      Member.associate = models => {
        Member.belongsTo(models.Major, {
          foreignKey: 'major_id',
          targetKey: 'id',
          as: 'major'
        });
      };

      return Member;
  }
};
