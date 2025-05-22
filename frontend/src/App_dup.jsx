function SignUp() {
  const [inputValue, setInputValue] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Age: '',
    Contact: '',
    Password: '',
    Cart: 0,
    Reviews: "No Reviews yet",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputValue({
      ...inputValue,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    let formerrors = {};

    if (inputValue.FirstName.trim() === '') {
      formerrors.FirstName = 'First Name is required';
    }

    if (inputValue.LastName.trim() === '') {
      formerrors.LastName = 'Last Name is required';
    }

    if (inputValue.Email.trim() === '') {
      formerrors.Email = 'Email is required';
    } else if (!/^[^\s@]+@(students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/.test(inputValue.Email)) {
      formerrors.Email = 'Email must end with @students.iiit.ac.in or @research.iiit.ac.in';
    }

    if (inputValue.Age.trim() === '') {
      formerrors.Age = 'Age is required';
    }

    if (inputValue.Contact.trim() === '') {
      formerrors.Contact = 'Contact is required';
    } else if (!/^[6-9]\d{9}$/.test(inputValue.Contact)) {
      formerrors.Contact = 'Invalid Contact number';
    }

    if (inputValue.Password.trim() === '') {
      formerrors.Password = 'Password is required';
    }
    inputValue.Cart = 0;
    inputValue.Reviews = "No Reviews yet";
    setErrors(formerrors);

    return Object.keys(formerrors).length === 0;
  };
  const navigate = useNavigate();
  const SendToDB = async () => {
    try {
      const data = { FirstName: inputValue.FirstName,
         LastName: inputValue.LastName, Email: inputValue.Email, Age: inputValue.Age, 
         Contact: inputValue.Contact, Password: inputValue.Password , Cart: inputValue.Cart, Reviews: inputValue.Reviews};
      const response = await SendPostRequest('/api/users', data);
      console.log('Response:', response);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      SendToDB();
      // alert('Form submitted successfully');
      console.log(inputValue);
      // navigate('/Dashboard');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>SignUp/Registration</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="FirstName">First Name:</label><br />
        <input
          type="text"
          id="FirstName"
          name="FirstName"
          value={inputValue.FirstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
        />
        {errors.FirstName && <p style={{ color: 'red' }}>{errors.FirstName}</p>}
        <br /><br />

        <label htmlFor="LastName">Last Name:</label><br />
        <input
          type="text"
          id="LastName"
          name="LastName"
          value={inputValue.LastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
        />
        {errors.LastName && <p style={{ color: 'red' }}>{errors.LastName}</p>}
        <br /><br />

        <label htmlFor="Email">Email Address:</label><br />
        <input
          type="email"
          id="Email"
          name="Email"
          value={inputValue.Email}
          onChange={handleInputChange}
          placeholder="Enter your Email"
        />
        {errors.Email && <p style={{ color: 'red' }}>{errors.Email}</p>}
        <br /><br />

        <label htmlFor="Age">Age:</label><br />
        <input
          type="number"
          id="Age"
          name="Age"
          value={inputValue.Age}
          onChange={handleInputChange}
          placeholder="Enter your Age"
        />
        {errors.Age && <p style={{ color: 'red' }}>{errors.Age}</p>}
        <br /><br />

        <label htmlFor="Contact">Contact:</label><br />
        <input
          type="tel"
          id="Contact"
          name="Contact"
          value={inputValue.Contact}
          onChange={handleInputChange}
          placeholder="Enter your mobile number"
        />
        {errors.Contact && <p style={{ color: 'red' }}>{errors.Contact}</p>}
        <br /><br />

        <label htmlFor="Password">Password:</label><br />
        <input
          type="password"
          id="Password"
          name="Password"
          value={inputValue.Password}
          onChange={handleInputChange}
          placeholder="Enter your Password"
        />
        {errors.Password && <p style={{ color: 'red' }}>{errors.Password}</p>}
        <br /><br />

        <button style={{ backgroundColor: 'blue', color: 'white' }}>
          Submit
        </button>
      </form>
      <p>Already have an account? <a href="/Login">Login</a></p>
    </div>
  );
}
