import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
class MyModalForm extends Component {
  state = { validated: true };
  data = {};
  renderField = (f) => {
    this.data = this.props.modaldata.data;
    switch (f.type) {
      case "input": {
        return (
          <Form.Group controlId={f.controlId} key={f.label}>
            <Form.Label>{f.label}</Form.Label>
            <Form.Control
              placeholder={f.placeholder}
              required={f.required}
              onChange={this.handleChange}
              defaultValue={this.data[f.controlId]}
            />
          </Form.Group>
        );
      }
      case "select": {
        return (
          <Form.Group controlId={f.controlId} key={f.label}>
            <Form.Label>{f.label}</Form.Label>
            <Form.Control
              as="select"
              placeholder={f.placeholder}
              required={f.required}
              onChange={this.handleChange}
              defaultValue={this.data[f.controlId]}
            >
              {f.items.map((item) => (
                <option value={item.val} key={item.val}>
                  {item.text}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        );
      }
      default:
        return null;
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.props.onSave(this.data);
    }
    this.setState({ validated: true });
  };
  handleChange = ({ currentTarget: input }) => {
    this.data[input.id] = input.value;
  };

  render() {
    const { onHide, modaldata, show } = this.props;
    const { validated } = this.state;

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {modaldata.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
            <div className="form-group">
              {modaldata.fields.map((f) => this.renderField(f))}
            </div>
            <Button type="submit">Save</Button>
          </Form>
        </Modal.Body>
        {/* <Modal.Footer>
        
          
        </Modal.Footer> */}
      </Modal>
    );
  }
}

export default MyModalForm;
