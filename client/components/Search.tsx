import React, {
  useState,
  FormEvent,
  ReactComponentElement,
  useEffect
} from 'react';
import TextField, { Input } from '@material/react-text-field';
import './Search.scss';
import MaterialIcon from '@material/react-material-icon';
import List, {
  ListItem,
  ListItemGraphic,
  ListItemText,
  ListItemMeta
} from '@material/react-list';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from '@material/react-button';
import { Caption } from '@material/react-typography';
import SEND_REQUEST from './../mutations/sendRequest';

const GET_SEARCH_RESULT = gql`
  query Users($searchTerm: String) {
    users(searchTerm: $searchTerm) {
      id
      username
    }
  }
`;

function renderList(searchText) {
  if (!searchText) return [];
  return (
    <Query query={GET_SEARCH_RESULT} variables={{ searchTerm: searchText }}>
      {({ loading, error, data: { users } }: any) => {
        if (loading) return 'loading...';
        if (error) return 'error...';

        return (
          <Mutation mutation={SEND_REQUEST}>
            {(newRequest, { data }: any) => (
              <List>
                {users.map(u => (
                  <ListItem key={Math.random()} className="friendList">
                    <ListItemGraphic
                      className="profilePic"
                      graphic={<img src={`/profileImage/${u.id}`} />}
                    />
                    <ListItemText primaryText={u.username} />
                    <ListItemMeta
                      meta={
                        <Button
                          onClick={() =>
                            newRequest({ variables: { id: u.id } })
                          }
                        >
                          <Caption>Send Request</Caption>
                        </Button>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
}

function Search() {
  const [searchText, changeSearchText] = useState('');
  const [searchList, changeSearchList] = useState(['hi', 'bye', 'die', 'died']);
  const [shouldRenderList, setRenderList] = useState(false);

  useEffect(() => {
    setRenderList(false);
    const timer = setTimeout(() => {
      setRenderList(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <div>
      <TextField
        className="search-field"
        label="Enter username"
        leadingIcon={<MaterialIcon role="button" icon="search" />}
      >
        <Input
          value={searchText}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            changeSearchText(e.currentTarget.value);
          }}
        />
      </TextField>
      {shouldRenderList && renderList(searchText)}
    </div>
  );
}

export default Search;
