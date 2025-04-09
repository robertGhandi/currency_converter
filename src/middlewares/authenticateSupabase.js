import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';

const authenticateSupabase = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.warn("Unauthorized access attempt - invalid token", { ip: req.ip })
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized. Please provide a valid token'
        });
    }

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data?.user) {
        logger.warn("Unauthorized access attempt - invalid token")
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized. Invalid token'
        });
    }

    logger.info("User authenticated successfully", { userId: data.user.id, email: data.user.email, ip: req.ip})

    req.user = data.user;
    next();
}

export default authenticateSupabase;