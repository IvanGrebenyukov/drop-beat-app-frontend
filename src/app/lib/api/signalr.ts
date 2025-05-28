import { HubConnectionBuilder } from '@microsoft/signalr'

export const createHubConnection = () => {
	return new HubConnectionBuilder()
		.withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chat-hub`)
		.withAutomaticReconnect()
		.build();
};