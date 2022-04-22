export default interface UserSchema {
    email: string | null;
    displayName: string | null;
    photoURL: string;
    isAdmin: boolean;
    isActive: boolean;
    registrationToken: string;
}