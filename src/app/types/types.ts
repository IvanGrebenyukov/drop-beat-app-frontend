// Тип для GUID (уникальный идентификатор)
export type Guid = string;

export interface Genre {
	id: Guid
	name: string
	iconUrl: string
}

export interface Mood {
	id: Guid
	name: string
	iconUrl?: string
}

export interface Beat {
	id: string
	title: string
	price: number
	bpm: number
	sellerName: string
	sellerId: string
	coverUrl: string
	audioKeyDemo: string
	licenseType: 'Free' | 'NonExclusive' | 'Exclusive'
	isAvailable: boolean
}

export interface BeatDetails {
	id: string
	title: string
	description: string
	price: number
	bpm: number
	createdAt: string
	coverUrl: string
	audioKeyDemo: string
	licenseDocument: string
	sellerId: string
	sellerName: string
	genres: string[]
	moods: string[]
	tags: string[]
}


export interface FollowUser {
	userId: string
	stageName: string
	avatarUrl: string | null
	isSeller: boolean
}

export type Tag = {
	id: string;
	name: string;
};
