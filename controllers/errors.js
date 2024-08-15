const get404 = (req, res, next) => {
    res.status(404)
        .render('404', {
            pageTitle: 'Not found'
        });
};

const get500 = (req, res, next) => {
    res.status(500)
        .render('errors/500', {
            pageTitle: 'Internal Server Error'
        });
};

module.exports = {
    get404,
    get500,
};
