const { getUsers } = require('./routes/getUsers')
const { getVideos } = require('./routes/getVideos')
const { getUserAssignments } = require('./routes/getUserAssignments')
const { assignVideo } = require('./routes/assignVideo')
const { deleteAssignment } = require('./routes/deleteAssignment')

module.exports = {
  getUsers,
  getVideos,
  getUserAssignments,
  assignVideo,
  deleteAssignment,
}
