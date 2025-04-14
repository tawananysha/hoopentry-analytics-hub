
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  Loader2, 
  Save, 
  User, 
  PlusCircle, 
  ArrowRight, 
  Calendar, 
  CreditCard, 
  Banknote, 
  Ticket, 
  UserCheck
} from 'lucide-react';
import { useAppContext, Gender, PaymentMethod, calculateTicketDetails } from '@/context/AppContext';
import BasketballLogo from '@/components/BasketballLogo';

const EntryForm: React.FC = () => {
  const navigate = useNavigate();
  const { addEntry } = useAppContext();
  
  // Form state
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [studentCardVerified, setStudentCardVerified] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  
  // UI state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ticketInfo, setTicketInfo] = useState<{ ticketType: string; ticketPrice: number } | null>(null);

  // Calculate ticket type and price when relevant fields change
  useEffect(() => {
    const parsedAge = parseInt(age);
    if (!isNaN(parsedAge)) {
      const details = calculateTicketDetails(parsedAge, isStudent, studentCardVerified);
      setTicketInfo(details);
    } else {
      setTicketInfo(null);
    }
  }, [age, isStudent, studentCardVerified]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAge = parseInt(age);
    
    if (isNaN(parsedAge)) {
      toast.error("Please enter a valid age");
      return;
    }

    if (parsedAge < 0 || parsedAge > 120) {
      toast.error("Please enter a valid age between 0 and 120");
      return;
    }

    if (!gender) {
      toast.error("Please select a gender");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Double-check student card verification
    if (isStudent && !studentCardVerified && parsedAge >= 10) {
      toast.error("Please verify the student card or uncheck the student option");
      return;
    }

    setIsProcessing(true);

    // Calculate the ticket type and price
    const { ticketType, ticketPrice } = calculateTicketDetails(
      parsedAge,
      isStudent,
      studentCardVerified
    );

    // Add the entry to the context
    addEntry({
      name: name.trim() || undefined,
      age: parsedAge,
      gender,
      isStudent,
      studentCardVerified,
      ticketType,
      ticketPrice,
      paymentMethod,
    });

    // Show success message
    toast.success(`${ticketType} ticket processed successfully`);

    // Reset form or navigate based on preference
    setTimeout(() => {
      setIsProcessing(false);
      // Reset form
      setName('');
      setAge('');
      setGender('Male');
      setIsStudent(false);
      setStudentCardVerified(false);
      setPaymentMethod('Cash');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Process New Entry</h1>
          <p className="text-muted-foreground">Record a new attendee at your basketball event</p>
        </div>
        <BasketballLogo size={50} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-5">
        <div className="space-y-6 md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-basketball-orange" />
                Attendee Information
              </CardTitle>
              <CardDescription>
                Enter the basic information about the attendee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      placeholder="Enter attendee name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="age" className="required">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter age"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label className="required">Gender</Label>
                      <RadioGroup 
                        value={gender} 
                        onValueChange={(value) => setGender(value as Gender)}
                        className="flex gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="gender-male" />
                          <Label htmlFor="gender-male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="gender-female" />
                          <Label htmlFor="gender-female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="gender-other" />
                          <Label htmlFor="gender-other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-student"
                        checked={isStudent}
                        onCheckedChange={(checked) => {
                          setIsStudent(checked as boolean);
                          if (!checked) setStudentCardVerified(false);
                        }}
                      />
                      <Label htmlFor="is-student">Is a Student</Label>
                    </div>
                    
                    {isStudent && parseInt(age) >= 10 && (
                      <div className="ml-6 flex items-center space-x-2 mt-2 p-2 bg-muted rounded-md">
                        <Checkbox
                          id="student-card-verified"
                          checked={studentCardVerified}
                          onCheckedChange={(checked) => setStudentCardVerified(checked as boolean)}
                        />
                        <Label htmlFor="student-card-verified" className="font-medium text-basketball-blue">
                          Student card verified
                        </Label>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="payment-method" className="required">Payment Method</Label>
                    <Select 
                      value={paymentMethod} 
                      onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">
                          <div className="flex items-center">
                            <Banknote className="mr-2 h-4 w-4" />
                            Cash
                          </div>
                        </SelectItem>
                        <SelectItem value="Card">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Card
                          </div>
                        </SelectItem>
                        <SelectItem value="Voucher">
                          <div className="flex items-center">
                            <Ticket className="mr-2 h-4 w-4" />
                            Voucher
                          </div>
                        </SelectItem>
                        <SelectItem value="Free Entry">
                          <div className="flex items-center">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Free Entry
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate('/')}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-basketball-orange hover:bg-basketball-orange/90"
                    disabled={isProcessing || !age || isNaN(parseInt(age))}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Process Entry
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Summary</CardTitle>
                <CardDescription>
                  Based on provided information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ticketInfo ? (
                  <div className="space-y-4">
                    <div className="ticket-card bg-white rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <BasketballLogo size={30} />
                          <h3 className="font-bold text-lg">HoopEntry</h3>
                        </div>
                        <div className="px-3 py-1 bg-basketball-blue rounded-full text-white text-sm">
                          {ticketInfo.ticketType}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Ticket Type</p>
                          <p className="font-medium">{ticketInfo.ticketType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="font-medium text-basketball-orange">R{ticketInfo.ticketPrice}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Valid Today Only</span>
                        <span className="font-mono">#EVENT-TICKET</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Calculated Price:</span>
                        <span className="font-semibold">R{ticketInfo.ticketPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ticket Type:</span>
                        <span className="font-semibold">{ticketInfo.ticketType}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Ticket className="h-10 w-10 text-muted-foreground mb-2" />
                    <p>Enter attendee information to see ticket details</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-basketball-blue/10 text-basketball-blue">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Enter Age & Gender</p>
                      <p className="text-sm text-muted-foreground">Required for all attendees</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-basketball-blue/10 text-basketball-blue">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Student Verification</p>
                      <p className="text-sm text-muted-foreground">Check student card for discount</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-basketball-blue/10 text-basketball-blue">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Record Payment</p>
                      <p className="text-sm text-muted-foreground">Select payment method</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryForm;
