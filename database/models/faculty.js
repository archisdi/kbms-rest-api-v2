/* jshint indent: 2 */

const model = (DataTypes) => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
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
  tableName: 'faculties',
  freezeTableName: true,
  underscored: true,
  paranoid: true /** Soft deletes */
};

module.exports = {
  options,
  model,
  default: function (sequelize, dataTypes) {
      const Faculty = sequelize.define('Faculty', model(dataTypes), options);

      Faculty.associate = models => {
        Faculty.hasMany(models.Major, {
          foreignKey: 'faculty_id',
          targetKey: 'id',
          as: 'majors'
        });
      };

      return Faculty;
  }
};
