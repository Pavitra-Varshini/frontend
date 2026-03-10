import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Note } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Signup: undefined;
  Login: undefined;
  OTPVerification: { email: string; operation: 'signup' | 'login' };
  Dashboard: undefined;
  AddNote: undefined;
  EditNote: { note: Note };
};

export type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;
export type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type OTPVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTPVerification'>;
export type OTPVerificationScreenRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;
export type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
export type AddNoteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddNote'>;
export type EditNoteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditNote'>;
export type EditNoteScreenRouteProp = RouteProp<RootStackParamList, 'EditNote'>;
