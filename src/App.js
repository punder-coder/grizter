import logo from './logo.svg';
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,

  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,

  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,

  Card,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
  CardImg,

  Table,
  Collapse,
  Row,


} from 'reactstrap';

import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { MdEmail, MdHome } from "react-icons/md";
import { RiKeyFill } from "react-icons/ri";
import { FaUser, FaShippingFast } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { GiPhone, IconName } from "react-icons/gi";

import fire_base from "./firebase/firebase";

import ImageUploader from 'react-images-upload';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      address: '',
      email: '',
      password: '',
      phone: '',

      modalSignin: false,
      modalRegistor: false,
      modalCart: false,
      modalPayment: false,

      collapsedNav: true,
      CollapsedCart: false,

      id: null,
      profile: null,

      goods: [],
      cart: [],

      cartItem: [],


      firstnameBill: '',
      lastnameBill: '',
      addressBill: '',
      phoneBill: '',
      checkSetDefault: true,

      namePayment: '',

      imageFile: null,



    };
    this.onDrop = this.onDrop.bind(this);


  }

  onDrop(picture) {
    this.setState({
      imageFile: picture[0],
    });
    console.log(this.state.imageFile);
  }

  onLogin = async () => {
    console.log(this.state.email);
    await fire_base.login(this.state.email, this.state.password, this.LoginSuccess, this.unsuccess);
  }

  LoginSuccess = async (data) => {
    console.log(data.user.uid);
    await fire_base.getProfile(data.user.uid, this.getProfileSuccess, this.unsuccess);
    this.toggleSignin();
  }

  getProfileSuccess = (querySnapshot) => {
    let profile = null;
    let id = null
    querySnapshot.forEach(doc => {
      profile = doc.data();
      id = doc.id
    });
    this.setState({ id: id });
    this.setState({ profile: profile });
    this.setState({ firstnameBill: profile.firstname });
    this.setState({ lastnameBill: profile.lastname });
    this.setState({ addressBill: profile.address });
    this.setState({ phoneBill: profile.phone })

    console.log(this.state.profile);
  }

  unsuccess = (error) => {
    console.log(error);
  }

  toggleSignin = () => {
    this.setState({ email: '' });
    this.setState({ password: '' });
    this.setState({ modalSignin: !this.state.modalSignin });
  }

  toggleRegistor = () => {
    this.setState({ firstname: '' });
    this.setState({ lastname: '' });
    this.setState({ email: '' });
    this.setState({ password: '' });
    this.setState({ address: '' });
    this.setState({ modalRegistor: !this.state.modalRegistor });
  }

  togglePayment = () => {
    this.setState({ modalPayment: !this.state.modalPayment });
  }

  toggleCart = () => {
    this.setState({ modalCart: !this.state.modalCart });
    this.setState({ CollapsedCart: false });
  }

  toggleNavbar = () => {
    this.setState({ collapsedNav: !this.state.collapsedNav });
  }

  onCreateAccount = async () => {
    await fire_base.createUser(this.state.email, this.state.password, this.createAccountSuccess, this.unsuccess);
  }

  createAccountSuccess = async (data) => {
    //console.log(data.user.uid);
    let profile = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      uid: data.user.uid,
      address: this.state.address,
      phone: this.state.phone
    }
    await fire_base.addProfile(profile, this.addProfileSuccess, this.unsuccess);
  }

  addProfileSuccess = () => {
    this.toggleRegistor();
  }

  onSignOut = async () => {
    await fire_base.signOut(this.signOutSuccess, this.unsuccess);

  }

  signOutSuccess = () => {
    console.log('log out');
    this.setState({ profile: null });
  }

  componentDidMount = async () => {
    await fire_base.getGoods(this.getGoodsSuccess, this.unsuccess);
  }

  getGoodsSuccess = (querySnapshot) => {
    let formatter = new Intl.NumberFormat('th', {
      style: 'currency',
      currency: 'THB',
    });
    let goods = {};
    let index = 0;
    querySnapshot.forEach(doc => {
      let textspec = "";
      goods = doc.data();
      goods.id = doc.id;
      goods.index = index;
      doc.data().spec.forEach(spec => {
        textspec += spec;
        //listspec.push(<CardText style={{height:30}}>{spec}</CardText>);
      })
      let item = <Card key={index}>
        <CardImg top width="100%" src={goods.imageUrl} />
        <CardBody>
          <CardTitle tag="h5">{goods.name}</CardTitle>
          <CardText id={doc.id}>{textspec}</CardText>
          <CardSubtitle tag="h6" style={{ marginTop: 30 }} className="mb-2 text-muted">Price: {formatter.format(goods.price).replace(/\b(\w*THB\w*)\b/, '฿ ')}</CardSubtitle>
          <CardLink href="#" onClick={(e) => this.onAddToCart(e, doc.data(), doc.id, index)}>Add to cart</CardLink>
        </CardBody>
      </Card>
      //document.getElementById(doc.id).innerHTML = textspec
      this.setState({ goods: this.state.goods.concat(item) });
      //console.log(goods);
      index++;
    });
    //console.log(this.state.goods);
  }

  onAddToCart = (e, data, id, index) => {
    e.preventDefault();

    if (this.state.profile != null) {
      let item = data;
      item.id = id;
      item.index = index;
      if (this.state.cart.length == 0) {
        item.amount = 1;
        this.setState({ cart: this.state.cart.concat(item) });
      } else {
        for (let i = 0; i < this.state.cart.length; i++) {
          if (this.state.cart[i].id == item.id && this.state.cart[i].amount < this.state.cart[i].stock) {
            let itemC = this.state.cart;
            itemC[i].amount = 1;
            this.setState({ cart: itemC });
            return;
          }
        }
        item.amount = 1;
        this.setState({ cart: this.state.cart.concat(item) });
      }
      //alert("Add to cart success!!");
    } else {
      this.toggleSignin();
    }

    console.log(data);
  }



  onCart = (e) => {
    e.preventDefault();
    let formatter = new Intl.NumberFormat('th', {
      style: 'currency',
      currency: 'THB',
    });
    if (this.state.profile != null) {
      let num = 1;
      let item = []
      this.state.cart.forEach(doc => {
        let t = <tr>
          <th scope="row">{num}</th>
          <td>{doc.name}</td>
          <td><Input placeholder="Amount" min={1} max={doc.stock} type="number" step="1" defaultValue={doc.amount} onChange={(e) => this.changeAmount(num, e)} /></td>
          <td>{formatter.format(this.state.cart[num - 1].price * this.state.cart[num - 1].amount).replace(/\b(\w*THB\w*)\b/, '฿ ')}</td>
        </tr>
        item.push(t);
        num += 1;
        console.log(item);
      });

      this.setState({ cartItem: item });
      this.toggleCart();
    } else {
      this.toggleSignin();
    }
  }

  changeAmount = (num, e) => {
    let c = this.state.cart;
    c[num - 2].amount = Number(e.currentTarget.value);
    this.setState({ cart: c });
  }

  calTotalPrice = () => {
    let formatter = new Intl.NumberFormat('th', {
      style: 'currency',
      currency: 'THB',
    });
    let sum = 0;
    this.state.cart.forEach(doc => {
      sum += (doc.price * doc.amount);
    });
    return formatter.format(sum).replace(/\b(\w*THB\w*)\b/, '฿ ');
  }

  countCart = () => {
    let count = 0;
    this.state.cart.forEach(doc => {
      count++;
    });
    return count;
  }

  onBuy = () => {
    if (this.state.cart.length > 0) {
      this.setState({ CollapsedCart: true });
    }
  }

  onConfirm = async () => {
    let profile = {
      firstname: this.state.firstnameBill,
      lastname: this.state.lastnameBill,
      address: this.state.addressBill,
      phone: this.state.phoneBill,
    }
    if (!this.state.checkSetDefault) {
      console.log(this.state.id);
      this.setState({profile:{...this.state.profile,firstname:this.state.firstnameBill}});
      await fire_base.updateProfile(profile, this.state.id, this.updateProfileSuccess, this.unsuccess);
    }
    let bill = {
      cart: this.state.cart,
      id: this.state.id,
      profile: profile,
      totalprice: this.calTotalPrice(),
    }
    await fire_base.addBill(bill, this.addBillSuccess, this.unsuccess);
    this.setState({cart:[],cartItem:[]});

  }

  addBillSuccess = (doc) => {
    this.toggleCart();
  }

  addPaymentSuccess = (doc) => {
    this.togglePayment();
  }

  updateProfileSuccess = () => {

  }

  onPayment = async () => {
    await fire_base.uplaodToFirebase(this.state.imageFile, this.uplaodToFirebaseSuccess, this.unsuccess)


  }

  uplaodToFirebaseSuccess = async (url) => {
    //console.log(url);
    let payment = {
      customer: this.state.namePayment,
      imageUrl: url,
    }
    await fire_base.addPayment(payment, this.addPaymentSuccess, this.unsuccess);
  }

  // onPickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Photo,
  //     allowsEditing: true,
  //     quality: 1,
  //   });
  //   if (!result.cancelled) {
  //     console.log(result);
  //     await this.setState({ imageUri: result.uri });
  //   }
  // };

  clearCart=()=>{
    this.setState({cartItem:[],cart:[]});
    this.setState({ CollapsedCart: false });
    
  }

  render() {
    return (
      <div className="App">
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Grizter</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsedNav} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="#" onClick={(e) => { e.preventDefault(); this.togglePayment(); }}>Payment</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={(e) => this.onCart(e)}>
                  <Badge badgeContent={this.countCart()} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </NavLink>
              </NavItem>
            </Nav>
            {this.state.profile != null && (
              <div>
                <label style={{ marginRight: 10, marginTop: 8 }}>{this.state.profile.firstname}</label>
                <Button color="primary" style={{ marginRight: 10 }} onClick={this.onSignOut}>Sign out</Button>
              </div>
            )}
            {this.state.profile == null && (
              <div>
                <Button color="primary" onClick={this.toggleSignin} style={{ marginRight: 10 }}>Sign in</Button>
                <Button color="secondary" onClick={this.toggleRegistor} style={{ marginRight: 10 }}>Registration</Button>
              </div>
            )}

          </Collapse>
        </Navbar>
        <div className="div-card">
          {/* <Card>
        <CardImg top width="100%" src="https://www.bigtone.in.th/wp-content/uploads/2018/09/FD-PLY-Strat-3TS-PF-1.jpg" alt="Card image cap" />
        <CardBody>
          <CardTitle tag="h5">Card title</CardTitle>
          <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
          <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>
          <CardLink href="#">Buy</CardLink>
        </CardBody>
      </Card> */}
          {this.state.goods}
        </div>


        {/* modal */}
        <Modal isOpen={this.state.modalSignin} toggle={this.toggleSignin} style={{ width: '70vh' }} >
          <ModalHeader toggle={this.toggleSignin}>Sign in</ModalHeader>
          <ModalBody>
            <InputGroup style={{ paddingBottom: 10 }}>
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
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onLogin}>Login</Button>{' '}
            <Button color="secondary" onClick={this.toggleSignin}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalRegistor} toggle={this.toggleRegistor} >
          <ModalHeader toggle={this.toggleRegistor}>Registration</ModalHeader>
          <ModalBody>
            <InputGroup className="inputgroup">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><FaUser /></InputGroupText>
              </InputGroupAddon>
              <Input placeholder="firstname" type="text" value={this.state.firstname} onChange={e => this.setState({ firstname: e.target.value })} />
              <Input placeholder="lastname" type="text" value={this.state.lastname} onChange={e => this.setState({ lastname: e.target.value })} />
            </InputGroup>
            <InputGroup className="inputgroup">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><MdEmail /></InputGroupText>
              </InputGroupAddon>
              <Input placeholder="email" type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
            </InputGroup>
            <InputGroup className="inputgroup">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><RiKeyFill /></InputGroupText>
              </InputGroupAddon>
              <Input placeholder="password" type="password" required={true} value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
            </InputGroup>
            <InputGroup className="inputgroup">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><MdHome /></InputGroupText>
              </InputGroupAddon>
              <Input placeholder="address" type="text" required={true} value={this.state.address} onChange={e => this.setState({ address: e.target.value })} />
            </InputGroup>
            <InputGroup className="inputgroup">
              <InputGroupAddon addonType="prepend">
                <InputGroupText><GiPhone /></InputGroupText>
              </InputGroupAddon>
              <Input placeholder="Phone" type="text" value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onCreateAccount}>Create Account</Button>{' '}
            <Button color="secondary" onClick={this.toggleRegistor}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalCart} toggle={this.toggleCart} style={{ width: '150vh' }} >
          <ModalHeader toggle={this.toggleCart}>Cart</ModalHeader>
          <ModalBody>
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {this.state.cartItem}
                <tr>
                  <th scope="row"></th>
                  <td><FaShippingFast /> Shipping</td>
                  <td></td>
                  <td>0</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>Total</th>
                  <th>{this.calTotalPrice()}</th>
                </tr>
              </thead>

            </Table>
            <div>
              {this.state.profile != null && (
                <Collapse isOpen={this.state.CollapsedCart}>
                  <InputGroup className="inputgroup">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><FaUser /></InputGroupText>
                    </InputGroupAddon>

                    <Input placeholder="firstname" type="text" value={this.state.firstnameBill} onChange={e => this.setState({ firstnameBill: e.target.value })} />
                    <Input placeholder="lastname" type="text" value={this.state.lastnameBill} onChange={e => this.setState({ lastnameBill: e.target.value })} />
                  </InputGroup>

                  <InputGroup className="inputgroup">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><MdHome /></InputGroupText>
                    </InputGroupAddon>

                    <Input placeholder="Address" type="text" value={this.state.addressBill} onChange={e => this.setState({ addressBill: e.target.value })} />
                  </InputGroup>

                  <InputGroup className="inputgroup">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><GiPhone /></InputGroupText>
                    </InputGroupAddon>

                    <Input placeholder="Phone" type="tel" value={this.state.phoneBill} onChange={e => this.setState({ phoneBill: e.target.value })} />
                  </InputGroup>

                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Input addon type="checkbox" checked={this.checkSetDefault} onChange={() => { this.setState({ checkSetDefault: !this.state.checkSetDefault }); console.log(this.state.checkSetDefault) }} /><label style={{ fontSize: 10, paddingLeft: 10, fontWeight: "bold" }}>Set As Default</label>
                  </div>

                </Collapse>)}

            </div>
          </ModalBody>
          <ModalFooter>
          <Button color="info" onClick={this.clearCart}>Clear</Button>
            {this.state.CollapsedCart && <Button color="primary" onClick={this.onConfirm} >Confirm</Button>}
            {!this.state.CollapsedCart && <Button color="primary" onClick={this.onBuy} >Buy</Button>}{' '}
            <Button color="secondary" onClick={this.toggleCart}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalPayment} toggle={this.togglePayment} style={{ width: '70vh' }} >
          <ModalHeader toggle={this.togglePayment}>Payment</ModalHeader>
          <ModalBody>
            <Table striped>
              <thead>
                <tr>

                  <th>Biller</th>
                  <th>Comp Code</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SCB</td>
                  <td>123456xxxx</td>
                  <td>chainan punsri</td>
                </tr>
                <tr>
                  <td>Krungthai</td>
                  <td>987654xxxx</td>
                  <td>chainan punsri</td>
                </tr>
                <tr>
                  <td>Bangkok Bank</td>
                  <td>135791xxxx</td>
                  <td>pacharaphol nachaingoen</td>
                </tr>
                <tr>
                  <td>Prompt Pay</td>
                  <td>08731696xx</td>
                  <td>pacharaphol nachaingoen</td>
                </tr>
              </tbody>
            </Table>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 10 }}>
              <label>Payment Detail</label>
              <Input placeholder="Customer Name" type="text" value={this.state.namePayment} onChange={e => this.setState({ namePayment: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ paddingRight: 10 }}>Comfirm Invoice</label>
              <ImageUploader
                singleImage={true}
                withPreview={true}
                withIcon={true}
                buttonText='Choose images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.png']}
                maxFileSize={5242880}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onPayment}>Confirm</Button>
            <Button color="secondary" onClick={this.togglePayment}>Cancel</Button>
          </ModalFooter>
        </Modal>


      </div >
    );
  }
}

export default App;
