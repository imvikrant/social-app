import React, { useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import GET_USER_DETAILS from '../queries/fetchUserDetails';
import TextField, { Input } from '@material/react-text-field';
import UPDATE_PROFILE from './../mutations/updateProfile';
import Select, { Option } from '@material/react-select';
import Button from '@material/react-button';
import './About.scss';

const renderTextField = (
  label: string,
  value: string | number,
  setFunction: Function,
  inputType = 'text'
): JSX.Element => {
  return (
    <TextField label={label} className={'text-fields'} outlined>
      <Input
        type={inputType}
        value={value}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setFunction(e.currentTarget.value)
        }
      />
    </TextField>
  );
};

const About = () => {
  // let [shouldSetUsername, setShouldSetUsername] = useState(true)
  let [fetchDetails, setFetchDetails] = useState(true);
  let [firstName, setFirstName] = useState('');
  let [gender, setGender] = useState('');
  let [age, setAge] = useState('');
  let [lastName, setLastName] = useState('');
  let [buttonText, setButtonText] = useState('SAVE CHANGES');

  return (
    <Query query={GET_USER_DETAILS}>
      {({ data, loading, error }: any) => {
        if (loading) return 'loading...';
        if (error) return 'error';

        if (fetchDetails) {
          data.user.firstName && setFirstName(data.user.firstName);
          data.user.lastName && setLastName(data.user.lastName);
          data.user.age && setAge(data.user.age);
          data.user.gender && setGender(data.user.gender);
          setFetchDetails(false);
        }

        return (
          <Mutation
            mutation={UPDATE_PROFILE}
            onCompleted={data => {
              console.log(data);
              setButtonText('CHANGES SAVED SUCCESSFULLY');

              setTimeout(() => setButtonText('SAVE CHANGES'), 2000);
            }}
            update={(cache, { data: { updateUser } }: any) => {
              console.log('start...');
              console.log('staore', cache);
              const { user } = cache.readQuery({ query: GET_USER_DETAILS });

              console.log('This is me', user);

              cache.writeQuery({
                query: GET_USER_DETAILS,
                data: {
                  user: {
                    ...user,
                    firstName: updateUser.firstName,
                    lastName: updateUser.lastName,
                    age: updateUser.age,
                    gender: updateUser.gender
                  }
                }
              });
            }}
          >
            {(updateProfile, { error, loading }: any) => (
              <div className="about">
                {renderTextField('FirstName', firstName, setFirstName)}
                {renderTextField('LastName', lastName, setLastName)}
                {/* {renderTextField("Gender", username, setUsername )} */}
                <Select
                  outlined
                  enhanced
                  label="Gender"
                  className="text-fields"
                  value={gender}
                  onEnhancedChange={(index, item) => {
                    setGender(item.getAttribute('data-value'));
                  }}
                >
                  <Option value="m">Male</Option>
                  <Option value="f">Female</Option>
                </Select>
                {renderTextField('Age', age, setAge, 'number')}

                <Button
                  outlined
                  onClick={() => {
                    updateProfile({
                      variables: { firstName, lastName, gender, age }
                    });
                    console.log(firstName, gender, age, lastName);
                    setButtonText('Saving Changes...');
                  }}
                >
                  {buttonText}
                </Button>
              </div>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default About;
