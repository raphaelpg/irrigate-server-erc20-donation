import { Request, Response, NextFunction } from 'express';
import isEmpty from 'validator/lib/isEmpty';

const checkRequestFields = (...fieldNames: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (Object.entries(req.body).length === 0) {
			return res.status(400).json({ status: 400, msg: "Request body is empty" });
		};
		const requestValues: string[] = Object.values(req.body);
		if (checkNotAStringValues(requestValues)) {
			return res.status(400).json({ status: 400, msg: "Request field must be a string" });
		};
		if (fieldNames[0] === "") {
			if (checkForEmptyValues(requestValues, [])) {
				return res.status(400).json({ status: 400, msg: "Requested field can't be empty" });
			};
			next();
		} else {
			if (checkForEmptyValues(fieldNames, req.body)) {
				return res.status(400).json({ status: 400, msg: "Requested field can't be empty" });
			};
			next();
		}
	};
};

const checkNotAStringValues: (values: string[]) => boolean = (values) => {
	let result = false;
	values.forEach((item: any) => {
		if (typeof(item) !== 'string') {
			result = true;
			return;
		};
	});
	return result;
};

const checkForEmptyValues: (values: string[], requestBody: string[]) => boolean = (values, requestBody) => {
	let result = false;
	if (requestBody.length === 0) {
		values.forEach((item: any) => {
			if (isEmpty(item)) {
				result = true;
				return;
			};
		});
	} else {
		values.forEach((item: any) => {
			if (isEmpty(requestBody[item])) {
				result = true;
				return;
			};
		});
	};
	return result;
} 

export default checkRequestFields;