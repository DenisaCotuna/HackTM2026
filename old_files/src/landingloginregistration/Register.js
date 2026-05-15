import React, {useState} from 'react';
import { Form, Button, Container, Row, Col, Card, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getData } from 'country-list';
import Select from 'react-select';
import './Register.css';
import RegisterLogo from './logo.png';

const countryOptions = getData().map(country => ({ value: country.code, label: country.name }));
const universityYears = {
    uvt: ['1st', '2nd', '3rd', '4th', 'Masters', 'PhD'],
    upt: ['1st', '2nd', '3rd', '4th', '5th', 'Masters', 'PhD'],
    umft: ['1st', '2nd', '3rd', '4th', '5th', '6th', 'Masters', 'PhD'],
    usabtm: ['1st', '2nd', '3rd', '4th', 'Masters', 'PhD']
};
const areaOptions = [
    { value: 'City Center', label: 'City Center' },
    { value: 'Student Complex', label: 'Student Complex' },
    { value: 'Iulius Town', label: 'Iulius Town' },
    { value: 'Buziasului', label: 'Buziasului' },
    { value: 'Mehala', label: 'Mehala' },
    { value: 'Freidorf', label: 'Freidorf' },
    { value: 'Ghiroda', label: 'Ghiroda' },
    { value: 'Dumbravita', label: 'Dumbravita' },
    { value: 'Lipovei', label: 'Lipovei' },
    { value: 'Calea Sagului', label: 'Calea Sagului' },
    { value: 'Calea Aradului', label: 'Calea Aradului' },
    { value: 'Calea Lugojului', label: 'Calea Lugojului' },
    { value: 'Calea Martirilor', label: 'Calea Martirilor' },
    { value: 'Calea Torontalului', label: 'Calea Torontalului' },
    { value: 'Calea Stan Vidrighin', label: 'Calea Stan Vidrighin' },
    { value: 'Other', label: 'Other' }
];

function Register() {
    const [errors, setErrors] = useState({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [userType, setUserType] = useState('student');
    const [university, setUniversity] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [studyField, setStudyField] = useState('');
    const [studyYear, setStudyYear] = useState('');
    const [minBudget, setMinBudget] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [preferredAreas, setPreferredAreas] = useState([]); // returns array of objects with value and label, will have to convert to string
    const [moveInDate, setMoveInDate] = useState('');
    const [duration, setDuration] = useState('');
    const [roomPreferences, setRoomPreferences] = useState('');
    const [roommates, setRoommates] = useState(false);
    const [smoker, setSmoker] = useState(false);
    const [pets, setPets] = useState(false);
    const [requiresInsurance, setRequiresInsurance] = useState(false);
    const [internationalStudents, setInternationalStudents] = useState(false);
    const [preferredGender, setPreferredGender] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    
    const validateForm = () => {
        const newErrors = {};

        if (!fullName) {
            newErrors.fullName = 'Full name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
            newErrors.fullName = 'Only letters, spaces and hyphens(-) are allowed';
        }
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S+$/.test(password)){
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and no spaces';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!nationality){
            newErrors.nationality = 'Please select your nationality';
        }
        if(!gender) {
            newErrors.gender = 'Please select your gender';
        }
        if (!phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{7,15}$/.test(phone)) {
            newErrors.phone = 'Phone number must contain only digits and can optionally start with a +, and must be between 7 and 15 digits long';
        }
        if(userType === 'student'){
            if (!university) {
                newErrors.university = 'Please select your university';
            }
            if (!studyField) {
                newErrors.studyField = 'Please enter your field of study';
            }
            if (!studyYear) {
                newErrors.studyYear = 'Please select your year of study';
            }
            if (!minBudget) {
                newErrors.minBudget = 'Please enter your minimum budget';
            }
            if (!maxBudget) {
                newErrors.maxBudget = 'Please enter your maximum budget';
            }
            if(minBudget && maxBudget && Number(minBudget) > Number(maxBudget)){
                newErrors.maxBudget = 'Maximum budget must be greater than minimum budget';
            }
            if (preferredAreas.length < 1) {
                newErrors.preferredAreas = 'Please select at least one preferred area';
            }
            if (!moveInDate) {
                newErrors.moveInDate = 'Please select your preferred move-in date';
            }
            if(!duration){
                newErrors.duration = 'Please select your expected duration of stay';
            }
            if (!roomPreferences) {
                newErrors.roomPreferences = 'Please enter your room preferences';
            }
            if (!roommates) {
                newErrors.roommates = 'Please enter your roommate preferences';
            }
        }
        if(userType === 'landlord'){
            if(!preferredGender){
                newErrors.preferredGender = 'Please select your preferred gender for tenants';
            }
        }
        return newErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            // Scroll to the first error
            setTimeout(() => {
                const firstErrorField = document.querySelector('.is-invalid');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        } else {
            setErrors({});
            console.log('Form submitted:', { fullName, email, password, confirmPassword, phone, userType, university, gender, nationality, studyField, studyYear, minBudget, maxBudget, preferredAreas, moveInDate, duration, roomPreferences, roommates, smoker, pets, requiresInsurance, internationalStudents, preferredGender, profilePhoto });
        }
    };
    return(
        <Container className='py-5'>
            <Row className='justify-content-center'>
                <Col md={10} lg={8}>
                    <div className='text-center mb-2'>
                        <img src={RegisterLogo} alt='App Logo' className='register-logo' />
                    </div>
                    <Card className='shadow p-4'>
                        <h2 className='text-center mb-4'>Create an Account</h2>
                        <div className='text-center'>
                            <p>Already have an account? <Link to="/">Log in</Link></p>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId='formFullName'>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={fullName}
                                    placeholder='Enter full name'
                                    isInvalid={!!errors.fullName}
                                    onChange={(e) => {setFullName(e.target.value)}}
                                />  
                                <Form.Control.Feedback type="invalid">
                                     {errors.fullName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formBasicEmail'>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formBasicPassword'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    isInvalid={!!errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formNationality'>
                                <Form.Label>Country</Form.Label>
                                <Select
                                    options={countryOptions}
                                    value={nationality}
                                    onChange={(option) => setNationality(option)}
                                    placeholder="Select your country"
                                    isSearchable
                                    className={errors.nationality ? 'is-invalid' : ''}
                                />
                                {errors.nationality && (
                                    <div className="invalid-feedback d-block">
                                        {errors.nationality}
                                    </div>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formGender'>
                                <Form.Label>Gender</Form.Label>
                                <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} isInvalid={!!errors.gender}>
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.gender}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formPhone'>
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter phone number e.g. +40712345678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    isInvalid={!!errors.phone}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formProfilePhoto'>
                                <Form.Label>Profile Photo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId='formUserType'>
                                <Form.Label>User Type</Form.Label>
                                <Form.Select value={userType} onChange={(e) => setUserType(e.target.value)}>
                                    <option value="student">Student</option>
                                    <option value="landlord">Landlord</option>
                                </Form.Select>
                            </Form.Group>
                            {userType === 'student' && (
                                <><Form.Group className="mb-3" controlId='formUniversity'>
                                    <Form.Label>University</Form.Label>
                                    <Form.Select value={university} 
                                        onChange={(e) => {
                                            setUniversity(e.target.value);
                                            setStudyYear('');
                                        }} 
                                        isInvalid={!!errors.university}>
                                        <option value="">Select your university</option>
                                        <option value="uvt">West University of Timisoara</option>
                                        <option value="upt">Politehnica University of Timisoara</option>
                                        <option value="umft">Victor Babes University of Medicine and Pharmacy</option>
                                        <option value="usabtm">University of Life Sciences "King Mihai I"</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.university}
                                    </Form.Control.Feedback>
                                </Form.Group><Form.Group className="mb-3" controlId='formStudyField'>
                                    <Form.Label>Field of Study</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={studyField}
                                        onChange={(e) => setStudyField(e.target.value)}
                                        isInvalid={!!errors.studyField}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.studyField}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formStudyYear'>
                                    <Form.Label>Year of Study</Form.Label>
                                    <Form.Select 
                                        value={studyYear} 
                                        onChange={(e) => setStudyYear(e.target.value)}
                                        disabled={!university}
                                        isInvalid={!!errors.studyYear}
                                    >
                                        <option value="">{university ? 'Select your year of study' : 'First select your university'}</option>
                                        {university && universityYears[university].map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.studyYear}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formMinBudget'>
                                    <Form.Label>Minimum Budget (€/month)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={minBudget}
                                        onChange={(e) => setMinBudget(e.target.value)}
                                        isInvalid={!!errors.minBudget}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.minBudget}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formMaxBudget'>
                                    <Form.Label>Maximum Budget (€/month)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={maxBudget}
                                        onChange={(e) => setMaxBudget(e.target.value)}
                                        isInvalid={!!errors.maxBudget}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.maxBudget}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formPreferredAreas'>
                                    <Form.Label>Preferred Areas</Form.Label>
                                    <Select
                                        options={areaOptions}
                                        value={preferredAreas}
                                        onChange={setPreferredAreas}
                                        isMulti
                                        isSearchable
                                        placeholder="Select preferred areas"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.preferredAreas}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formMoveInDate'>
                                    <Form.Label>Preferred Move-in Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={moveInDate}
                                        min ={new Date().toISOString().split('T')[0]} // prevent selecting past dates
                                        onChange={(e) => setMoveInDate(e.target.value)}
                                        isInvalid={!!errors.moveInDate}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.moveInDate}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formDuration'>
                                    <Form.Label>Expected Duration of Stay</Form.Label>
                                    <Form.Select value={duration} onChange={(e) => setDuration(e.target.value)} isInvalid={!!errors.duration}>
                                        <option value="">Select expected duration of stay</option>
                                        <option value="1-3 months">1-3 months</option>
                                        <option value="3-6 months">3-6 months</option>
                                        <option value="6-12 months">6-12 months</option>
                                        <option value="1+ year">1+ year</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                            {errors.duration}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formRoomPreferences'>
                                    <Form.Label>Room Preferences</Form.Label>
                                    <Form.Select value={roomPreferences} onChange={(e) => setRoomPreferences(e.target.value)} isInvalid={!!errors.roomPreferences}>
                                        <option value="">Select your room preferences</option>
                                        <option value="single">Single room</option>
                                        <option value="shared">Shared room</option>
                                        <option value="full">Full apartment</option>
                                        <option value="no preference">No preference</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.roomPreferences}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formRoommates'>
                                    <Form.Label>Open to Roommates?</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            label="Yes"
                                            name="roommates"
                                            type="radio"
                                            checked={roommates === true}
                                            onChange={(e) => setRoommates(true)}
                                        />
                                        <Form.Check
                                            inline
                                            label="No"
                                            name="roommates"
                                            type="radio"
                                            checked={roommates === false}
                                            onChange={(e) => setRoommates(false)}
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Smoker?"
                                        checked={smoker}
                                        onChange={(e) => setSmoker(e.target.checked)}
                                        />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Pet Owner?"
                                        checked={pets}
                                        onChange={(e) => setPets(e.target.checked)}
                                        />
                                </Form.Group>
                                </>
                            )}
                            {userType === 'landlord' && (
                                <><Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Requires Tenant Insurance"
                                        checked={requiresInsurance}
                                        onChange={(e) => setRequiresInsurance(e.target.checked)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Open to International Students?"
                                        checked={internationalStudents}
                                        onChange={(e) => setInternationalStudents(e.target.checked)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId='formPreferredGender'>
                                    <Form.Label>Preferred Tenant Gender</Form.Label>
                                    <Form.Select value={preferredGender} onChange={(e) => setPreferredGender(e.target.value)} isInvalid={!!errors.preferredGender}>
                                        <option value="">Select preferred tenant gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="no preference">No preference</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.preferredGender}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                </>
                                )}
                            <Button variant='primary' type='submit' className='submit-button' >
                                Create Account
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;