/* jshint indent: 2 */

const model = (DataTypes) => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  faculty_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'faculties',
      key: 'id'
    },
  },
  name: {
    type: DataTypes.STRING(255),
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
  tableName: 'majors',
  freezeTableName: true,
  underscored: true,
  paranoid: true /** Soft deletes */
};

module.exports = {
  options,
  model,
  default: function (sequelize, dataTypes) {
      const Major = sequelize.define('Major', model(dataTypes), options);

      Major.associate = models => {
        Major.hasMany(models.Member, {
          foreignKey: 'major_id',
          targetKey: 'id'
        });
    
        Major.belongsTo(models.Faculty, {
          foreignKey: 'faculty_id',
          targetKey: 'id',
          as: 'faculty'
        });
      };

      return Major;
  }
};
