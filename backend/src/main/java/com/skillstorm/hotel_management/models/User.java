
package com.skillstorm.hotel_management.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;
import java.util.Date;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Document(collection = "users")
public class User {
	@Id
	private String id;

	private String email;
	private String password;
	private String firstName;
	private String lastName;
	private String phoneNumber;
	private List<String> roles;
	private boolean isEmailVerified;
	private String provider;
	private String providerId;
	private String profileImage;
	private Map<String, Object> preferences;
	private List<Object> savedPaymentMethods;
	@CreatedDate
	private Date createdAt;
	@LastModifiedDate
	private Date updatedAt;

	public User(String email, String password, String firstName, String lastName, String phoneNumber,
			List<String> roles, Map<String, Object> preferences) {
		this.email = email;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.phoneNumber = phoneNumber;
		this.preferences = preferences;
		this.roles = roles;
		this.isEmailVerified = false;
		this.provider = null;
		this.providerId = null;
		this.profileImage = null;
		this.savedPaymentMethods = null;
	}

	public User(){}
	

	// Getters and setters
	public String getId() { return id; }
	public void setId(String id) { this.id = id; }

	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }

	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }

	public String getFirstName() { return firstName; }
	public void setFirstName(String firstName) { this.firstName = firstName; }

	public String getLastName() { return lastName; }
	public void setLastName(String lastName) { this.lastName = lastName; }

	public String getPhoneNumber() { return phoneNumber; }
	public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

	public List<String> getRoles() { return roles; }
	public void setRoles(List<String> roles) { this.roles = roles; }

	public boolean isEmailVerified() { return isEmailVerified; }
	public void setEmailVerified(boolean emailVerified) { isEmailVerified = emailVerified; }

	public String getProvider() { return provider; }
	public void setProvider(String provider) { this.provider = provider; }

	public String getProviderId() { return providerId; }
	public void setProviderId(String providerId) { this.providerId = providerId; }

	public String getProfileImage() { return profileImage; }
	public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

	public Map<String, Object> getPreferences() { return preferences; }
	public void setPreferences(Map<String, Object> preferences) { this.preferences = preferences; }

	public List<Object> getSavedPaymentMethods() { return savedPaymentMethods; }
	public void setSavedPaymentMethods(List<Object> savedPaymentMethods) { this.savedPaymentMethods = savedPaymentMethods; }

	public Date getCreatedAt() { return createdAt; }
	public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

	public Date getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}
