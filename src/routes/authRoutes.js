import express from "express";
import {
	signUp,
	signIn,
	resendVerificationEmail,
    emailVerificationRedirect,
} from "../controllers/authController.js";
import {
	registerSchema,
	loginSchema,
	validateRequest,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", validateRequest(registerSchema), signUp);
router.post("/signin", validateRequest(loginSchema), signIn);
router.post("/resend-verification", resendVerificationEmail);
router.get("/verify-email", emailVerificationRedirect);

export default router;
