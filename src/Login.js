import React from 'react';
import './Login.css'
import {
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdEmail } from "react-icons/md";
import { RiKeyFill } from "react-icons/ri";
import fire_base from "./firebase/firebase";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };


    }

    onLogin = async () => {
        console.log(this.state.email);
        await fire_base.login(this.state.email, this.state.password, this.LoginSuccess, this.unsuccess);
    }

    LoginSuccess = (data) => {
        console.log(data.user.uid);
    }

    unsuccess = (error) => {
        console.log(error);
    }

    render() {
        return (

            <div className="login">
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">reactstrap</NavbarBrand>
                    <NavbarToggler />
                    <Collapse navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/components/">Components</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/reactstrap/reactstrap" >GitHub</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Options
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Option 1
                                </DropdownItem>
                                    <DropdownItem>
                                        Option 2
                                </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        Reset
                                </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                        <NavbarText>Simple Text</NavbarText>
                    </Collapse>
                </Navbar>

                <div className="content" >
                    <div className="middle" >
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><MdEmail /></InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="email" type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><RiKeyFill /></InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="password" type="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                        </InputGroup>
                        <Button style={{ width: "100%" }} color="success" type="submit" onClick={this.onLogin} >login</Button>
                    </div>
                </div>
            </div >
        );
    }
}

export default Login;