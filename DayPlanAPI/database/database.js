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
            task_id: 'task_id',
            user_id: 'userID',
            isPeriodic: 'isPeriodic',
            name: 'name',
            description: 'description',
            startDate: 'startDate',
            isDaily: 'isDaily',
            isWeekly: 'isWeekly',
            weeklyOccurances: 'weeklyOccurances',
            category: 'category'
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