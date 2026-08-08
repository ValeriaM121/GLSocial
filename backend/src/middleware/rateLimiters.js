import rateLimit from "express-rate-limit";

/*
    With using express rate limiting library for rate limiting. We are
    using IP address to limit users request. Seperated auth limiting because
    it would all count as one counter for limits. Also each have different 
    needs for each type of auth path.

    What can be added is using email to limit. Especially for login.
    If someone is trying to login into someone's account if we just limit
    IP they can start using different devices to try to keep logging in.
    But for now will leave as IP limiting.
*/

export const LoginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 5,
    message:{
        message: "Too many attempts. Please try again later"
    },
    statusCode: 429
});

export const RegisterLimit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 10,
    message:{
        message: "Too many attempts. Please try again later"
    },
    statusCode: 429
});

export const ForgotPasswordLimit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 3,
    message:{
        message: "Too many attempts. Please try again later"
    },
    statusCode: 429
});

export const GoogleLimit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 5,
    message:{
        message: "Too many attempts. Please try again later"
    },
    statusCode: 429
});

export const ChangePasswordLimit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 4,
    message:{
        message: "Too many attempts. Please try again later"
    },
    statusCode: 429
});

export const APILimit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 100,
    message:{
        message: "Too many attempts. Please try again later"
    },
    statusCode:  429
});