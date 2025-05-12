package com.yma.app.custom_exception;

public class ForbiddenAccessException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ForbiddenAccessException() {
		super();
	}

	public ForbiddenAccessException(String message) {
		super(message);
	}

	public ForbiddenAccessException(String message, Throwable cause) {
		super(message, cause);
	}

	public ForbiddenAccessException(Throwable cause) {
		super(cause);
	}
}
