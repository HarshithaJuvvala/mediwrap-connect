
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BloodDonor {
  id?: string;
  user_id: string;
  name: string;
  blood_type: string;
  dob: string;
  phone: string;
  address: string;
  created_at?: string;
}

export interface BloodRequest {
  id?: string;
  blood_type: string;
  hospital: string;
  urgency: "Critical" | "Urgent" | "Medium";
  date_needed: string;
  reason: string;
  created_at?: string;
}

export class BloodDonationService {
  // Register a new blood donor
  async registerDonor(donorData: Omit<BloodDonor, "id" | "created_at">): Promise<BloodDonor | null> {
    try {
      const { data, error } = await supabase
        .from('blood_donors')
        .insert([donorData])
        .select()
        .single();
      
      if (error) {
        console.error('Error registering donor:', error);
        toast({
          title: "Error",
          description: "Failed to register as donor",
          variant: "destructive",
        });
        return null;
      }
      
      return data as BloodDonor;
    } catch (error) {
      console.error('Error in registerDonor:', error);
      return null;
    }
  }

  // Check if user is already registered as donor
  async checkDonorStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('blood_donors')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking donor status:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in checkDonorStatus:', error);
      return false;
    }
  }

  // Schedule a blood donation
  async scheduleDonation(donation: {
    user_id: string;
    center_id: number;
    center_name: string;
    date: string;
    time: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blood_donations')
        .insert([donation]);
      
      if (error) {
        console.error('Error scheduling donation:', error);
        toast({
          title: "Error",
          description: "Failed to schedule donation",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in scheduleDonation:', error);
      return false;
    }
  }

  // Get user's donation appointments
  async getUserDonations(userId: string) {
    try {
      const { data, error } = await supabase
        .from('blood_donations')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching user donations:', error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Error in getUserDonations:', error);
      return [];
    }
  }
}
