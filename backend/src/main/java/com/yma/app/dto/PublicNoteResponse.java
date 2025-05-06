package com.yma.app.dto;

public record PublicNoteResponse(Long id, String title, String content, OwnerDto owner,
		String updatedAt) {
	public record OwnerDto(String name, String email, String avatar) {
	}

}
