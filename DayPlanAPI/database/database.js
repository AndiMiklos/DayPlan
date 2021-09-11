var exports = module.exports = {}

exports.tables = {
    categories: {
        name: 'categories',
        columns: {
            id: 'id',
            name: 'Name',
            color: 'Color',
            userID: 'UserID'
        }
    },
    tasks: {
        name: 'tasks',
        columns: {
            id: 'id',
            userID: 'userID',
            categoryID: 'categoryID',
            isRecursive: 'isRecursive',
            name: 'name',
            description: 'description',
            created: 'created',
            isDaily: 'isDaily',
            isWeekly: 'isWeekly',
            weekly: 'weekly',
            startDate: 'startDate'
        }
    },
    users: {
        name: 'users',
        columns: {
            user_id: 'user_id',
            name: 'name',
            email: 'email',
            password: 'password',
            isAdmin: 'isAdmin'
        }
    }
}