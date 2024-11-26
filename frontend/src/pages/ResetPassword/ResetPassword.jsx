import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import "./ResetPassword.css"; // Import the CSS file
import { useAuthStore } from "../../store/authStore";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<div className="reset-password-container">
			<div className="reset-password-card">
				<h2 className="title">Reset Password</h2>
				{error && <p className="error-message">{error}</p>}
				{message && <p className="success-message">{message}</p>}

				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<Lock className="input-icon" />
						<input
							type="password"
							placeholder="New Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="input-field"
						/>
					</div>

					<div className="input-group">
						<Lock className="input-icon" />
						<input
							type="password"
							placeholder="Confirm New Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="input-field"
						/>
					</div>

					<button
						className="submit-button"
						type="submit"
						disabled={isLoading}
					>
						{isLoading ? "Resetting..." : "Set New Password"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
