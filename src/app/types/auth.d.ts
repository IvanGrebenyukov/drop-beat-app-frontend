export type AuthResponse = {
	token: string | null;
	expiration: string;
	userId: string;
	requiresEmailConfirmation: boolean;
	message?: string;
};

export type ConfirmationRequest = {
	userId: string;
	code: string;
};