import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import supabase from "../config/supabase.js";
import logger from "../utils/logger.js"

const signUp = async (req, res) => {
	const { email, first_name, last_name, password } = req.body;
	try {
        logger.info("User sign-up attempt", { email, first_name, last_name })
		//check if user exists
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
            logger.warn("user already exists", { email })
			return res.status(409).json({
				status: "error",
				message: "User already exists",
			});
		}

		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error) {
            logger.error("Supabase sign-up error", { email, error: error.message })
			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}

		if (!data.user) {
            logger.info("User registered. Please verify your email.", { email, first_name, last_name })
			return res.status(201).json({
				status: "success",
				message: "User registered. Please verify your email.",
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				id: data.user.id,
				email,
				first_name,
				last_name,
				password: hashedPassword,
			},
		});

        logger.info("user created successfully", { email, first_name, last_name })

		return res.status(201).json({
			status: "success",
			message: "User created successfully. Please verify your email",
			data: newUser,
		});
	} catch (error) {
        logger.error("Error creating user", { email, error: error.message })
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;

        logger.info("User sign-in attempt", { email })

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
            logger.warn("Sign-in error", { email, error: error.message })
			if (error.message.includes("Email not confirmed")) {
				return res.status(403).json({
					status: "error",
					message: "please verify your email before logging in.",
				});
			}
			return res.status(401).json({
				status: "error",
				message: error.message,
			});
		}

        logger.info("User signed in successfully", { email })

		return res.status(200).json({
			status: "success",
			message: "User signed in successfully",
			token: data.session.access_token,
			user: data.user,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const resendVerificationEmail = async (req, res) => {
	try {
		const { email } = req.body;
        logger.info("Resend verification email requested", { email })  

		const { error } = await supabase.auth.resend({
			type: "signup",
			email,
		});

		if (error) {
            logger.error("Error resending verification email", { email, error: error.message })
			return res.status(500).json({
				status: "error",
				message: error.message,
			});
		}

        logger.info("Verification email sent successfully", { email })

		return res.status(200).json({
			status: "success",
			message: "Verification email sent successfully",
		});
	} catch (error) {
        logger.error("Error resending verification email", { email, error: error.message })
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const emailVerificationRedirect = (req, res) => {
	logger.info("Email verified successfully")
    return res.status(200).send(`
        <html>
        <head>
            <title>Email Verified</title>
        </head>
        <body style="text-align: center; padding: 50px;">
            <h1>Email Verified Successfully</h1>
            <p>You can now close this window and log in.</p>
        </body>
        </html>
        `)
};

export { signUp, signIn, resendVerificationEmail, emailVerificationRedirect };
