package com.yma.app.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "notes")
public class Note {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	@Column(columnDefinition = "TEXT")
	private String content;

	private String shareToken;

	private boolean isPubliclyShared;

	private Instant createdAt;

	private Instant updatedAt;

	private String accessLevel;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	private List<NotePermission> sharedPermissions = new ArrayList<>();

	// Constructors
	public Note() {
	}

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public String getAccessLevel() {
		return accessLevel;
	}

	public void setAccessLevel(String accessLevel) {
		this.accessLevel = accessLevel;
	}

	public List<NotePermission> getSharedPermissions() {
		return sharedPermissions;
	}

	public void setSharedPermissions(List<NotePermission> sharedPermissions) {
		this.sharedPermissions = sharedPermissions;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public User getUser() {
		return user;
	}

	public boolean isPubliclyShared() {
		return isPubliclyShared;
	}

	public void setPubliclyShared(boolean isPubliclyShared) {
		this.isPubliclyShared = isPubliclyShared;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getShareToken() {
		return shareToken;
	}

	public void setShareToken(String shareToken) {
		this.shareToken = shareToken;
	}

	@PrePersist
	protected void onCreate() {
		Instant now = Instant.now();
		this.accessLevel = "private";
		this.createdAt = now;
		this.updatedAt = now;
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = Instant.now();
	}
}
