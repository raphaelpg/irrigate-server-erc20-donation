import { Request, Response } from 'express';
import userService from '../services/user.service';
import tokenFunctions from '../functions/tokenFunctions';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

const register = async (req: Request, res: Response) => {
	if (!isEmail(req.body.email)) {
		return res.status(400).json({ status: 400, msg: "Invalid email input" });
	};
	if (!isLength(req.body.password, {min:5, max:undefined})) {
		return res.status(400).json({ status: 400, msg: "Invalid password input" });
	};
	let query = req.body;
	try {
		await userService.serviceRegister(query);
		return res.status(201).json({ status: 201, msg: "User created" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const login = async (req: Request, res: Response) => {
	let query = req.body;
	try {
		const user = await userService.serviceLogin(query);
		if (user) {
			const token = tokenFunctions.sign(query);
			return res.status(200).json({ 
				status: 200, 
				msg: "User authorized", 
				token: token, 
				email: req.body.email, 
				subscribedAssociations: user.subscribedAssociations, 
				role: user.role
			});
		}
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const getUser = async (req: Request, res: Response) => {
	if (!isEmail(req.body.email)) {
		return res.status(400).json({ status: 400, msg: "Invalid email input" });
	};
	let query = req.body;
	try {
		const user = await userService.serviceGetUser(query.email);
		return res.status(200).json({ status: 200, data: user, msg: "User retrieved successfully" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const deleteUser = async (req: Request, res: Response) => {
	if (!isEmail(req.body.email)) {
		return res.status(400).json({ status: 400, msg: "Invalid email input" });
	};
	let query = req.body;
	try {
		await userService.serviceDeleteUser(query.email);
		return res.status(200).json({ status: 200, msg: 'User deleted' });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

const updateUserAssociations = async (req: Request, res: Response) => {
	if (!isEmail(req.body.email)) {
		return res.status(400).json({ status: 400, msg: "Invalid email input" });
	};
	let notAString = false
	req.body.subscribedAssociations.forEach((value: any) => {
		if (typeof(value) !== 'string') {
			notAString = true;
		}
	})
	if (notAString) {
		return res.status(400).json({ status: 400, msg: "Invalid association id" });
	}
	let query = req.body;
	try {
		await userService.serviceUpdateUserAssociations(query);
		return res.status(200).json({ status: 200, msg: "User associations updated" });
	} catch (e) {
		return res.status(400).json({ status: 400, msg: e.message });
	};
};

export default {
	register,
	login,
	getUser,
	deleteUser,
	updateUserAssociations
};