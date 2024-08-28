const get404 = (req, res, next) => {
    res.status(404)
        .render('errors/404', {
            pageTitle: 'Not found'
        });
};

const get500 = (req, res, next) => {
    res.status(500)
        .render('errors/500', {
            pageTitle: 'Internal Server Error'
        });
};

export default {
    get404,
    get500,
};
