module.exports = {
    url: 'users/{userId}',
    ev: 'onCreate',
    fn: app => event => {
        app.firestore().collection('foo').doc('foo').set({
            value: Math.random()
        })

        //event.data.data()
    }
}