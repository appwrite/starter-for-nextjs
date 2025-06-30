import { UCLUser } from '@/types/auth';

const UCL_API_BASE = process.env.UCLAPI_BASE_URL || 'https://uclapi.com';

class UCLAPIClient {
    private clientId: string;
    private clientSecret: string;

    constructor() {
        this.clientId = process.env.UCLAPI_CLIENT_ID!;
        this.clientSecret = process.env.UCLAPI_CLIENT_SECRET!;
    }

    // Generate OAuth URL for UCL login
    getAuthUrl(redirectUri: string, state?: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'user:read',
            ...(state && { state })
        });

        return `${UCL_API_BASE}/oauth/authorize?${params.toString()}`;
    }

    // Exchange authorization code for access token
    async exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
        try {
            const formData = new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            });

            const response = await fetch(`${UCL_API_BASE}/oauth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Token exchange failed:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (!data.access_token) {
                console.error('No access token in response:', data);
                throw new Error('No access token received');
            }

            return data.access_token;
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            throw new Error('Failed to exchange authorization code');
        }
    }

    // Get user information using access token
    // Get user information using access token
    async getUserInfo(accessToken: string): Promise<UCLUser> {
        try {
            const url = new URL(`${UCL_API_BASE}/oauth/user/data`);
            url.searchParams.append('token', accessToken);
            url.searchParams.append('client_secret', this.clientSecret);

            const response = await fetch(url.toString());

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('User info request failed:', response.status, errorData);
                throw new Error(`HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('User data response:', data);

            if (!data.ok) {
                throw new Error(data.error || 'Failed to fetch user data');
            }

            // Return the user data with proper mapping
            return {
                email: data.email,
                given_name: data.given_name,
                sn: data.sn, // surname from UCL API
                family_name: data.sn, // for compatibility
                full_name: data.full_name,
                cn: data.cn,
                department: data.department,
                student_id: data.student_id,
                staff_id: data.staff_id,
                is_student: data.is_student,
                is_staff: !data.is_student, // infer from is_student
                upi: data.upi,
                ucl_groups: data.ucl_groups,
                user_types: data.user_types,
                mail: data.mail,
            };
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw new Error('Failed to fetch user information');
        }
    }

    // Verify token validity
    async verifyToken(token: string): Promise<boolean> {
        try {
            await this.getUserInfo(token);
            return true;
        } catch {
            return false;
        }
    }
}

export const uclApiClient = new UCLAPIClient();