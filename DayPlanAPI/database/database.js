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
    tasks_history: {
        name: 'tasks_history',
        columns: {
            id: 'id',
            taskID: 'taskID',
            userID: 'userID',
            inserted: 'inserted'
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