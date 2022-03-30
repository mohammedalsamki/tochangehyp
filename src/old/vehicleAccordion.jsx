import React, { Component } from "react";
import { Accordion, Card } from "react-bootstrap";
// import { useAccordionToggle } from "react-bootstrap/AccordionToggle";

class MyAccordion extends Component {
  render() {
    const { manufacturers, manufacturerContents, modelContents } = this.props;

    return (
      <Accordion defaultActiveKey="0" style={{ cursor: "pointer" }}>
        {manufacturers.map((manufacturer) => (
          <Card key={manufacturer.id}>
            <Accordion.Toggle as={Card.Header} eventKey={manufacturer.id}>
              <div className="row">
                {manufacturerContents.map((mC) => mC.content(manufacturer))}
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={manufacturer.id}>
              <Card.Body>
                <div>
                  {manufacturer.models &&
                    manufacturer.models.map((model) => model.nameen)}

                  {/* <Accordion defaultActiveKey="0" style={{ cursor: "pointer" }}>
                    {manufacturer.models &&
                      manufacturer.models.map((model) => (
                        <Card>
                          <Accordion.Toggle
                            as={Card.Header}
                            eventKey={`${manufacturer.id}_${model.id}`}
                          >
                            <div className="row">{model.nameen}</div>
                          </Accordion.Toggle>
                          <Accordion.Collapse
                            eventKey={`${manufacturer.id}_${model.id}`}
                          >
                            Hi
                          </Accordion.Collapse>
                        </Card>
                      ))}
                  </Accordion> */}
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    );
  }
}

export default MyAccordion;
