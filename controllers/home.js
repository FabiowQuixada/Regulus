
const getHome = (req, res, next) => {
    res.render('home/home', {
        pageTitle: 'Home',
        path : '/'
    });
};

module.exports = {
    getHome,
};
