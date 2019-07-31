"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_text_field_1 = __importStar(require("@material/react-text-field"));
require("./Search.scss");
const react_material_icon_1 = __importDefault(require("@material/react-material-icon"));
const react_list_1 = __importStar(require("@material/react-list"));
const react_apollo_1 = require("react-apollo");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const react_button_1 = require("@material/react-button");
const react_typography_1 = require("@material/react-typography");
const sendRequest_1 = __importDefault(require("./../mutations/sendRequest"));
const GET_SEARCH_RESULT = graphql_tag_1.default `
  query Users($searchTerm: String) {
    users(searchTerm: $searchTerm) {
      id
      username
    }
  }
`;
function renderList(searchText) {
    if (!searchText)
        return [];
    return (react_1.default.createElement(react_apollo_1.Query, { query: GET_SEARCH_RESULT, variables: { searchTerm: searchText } }, ({ loading, error, data: { users } }) => {
        if (loading)
            return 'loading...';
        if (error)
            return 'error...';
        return (react_1.default.createElement(react_apollo_1.Mutation, { mutation: sendRequest_1.default }, (newRequest, { data }) => (react_1.default.createElement(react_list_1.default, null, users.map(u => (react_1.default.createElement(react_list_1.ListItem, { key: Math.random(), className: "friendList" },
            react_1.default.createElement(react_list_1.ListItemGraphic, { className: "profilePic", graphic: react_1.default.createElement("img", { src: `/profileImage/${u.id}` }) }),
            react_1.default.createElement(react_list_1.ListItemText, { primaryText: u.username }),
            react_1.default.createElement(react_list_1.ListItemMeta, { meta: react_1.default.createElement(react_button_1.Button, { onClick: () => newRequest({ variables: { id: u.id } }) },
                    react_1.default.createElement(react_typography_1.Caption, null, "Send Request")) }))))))));
    }));
}
function Search() {
    const [searchText, changeSearchText] = react_1.useState('');
    const [searchList, changeSearchList] = react_1.useState(['hi', 'bye', 'die', 'died']);
    const [shouldRenderList, setRenderList] = react_1.useState(false);
    react_1.useEffect(() => {
        setRenderList(false);
        const timer = setTimeout(() => {
            setRenderList(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchText]);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(react_text_field_1.default, { className: "search-field", label: "Enter username", leadingIcon: react_1.default.createElement(react_material_icon_1.default, { role: "button", icon: "search" }) },
            react_1.default.createElement(react_text_field_1.Input, { value: searchText, onChange: (e) => {
                    changeSearchText(e.currentTarget.value);
                } })),
        shouldRenderList && renderList(searchText)));
}
exports.default = Search;
