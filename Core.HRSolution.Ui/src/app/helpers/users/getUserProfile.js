import {useAuth} from '../../../../app/modules/auth'
const {currentUser} = useAuth()

// Helper function to determine user profile image path
const getUserProfileImage = () => {
    
    const genderNormalized = (currentUser.gender || '').toLowerCase();
    return `media/profile/user-${genderNormalized === 'male' ? 'male' : 'female'}.png`;
  };
  

  