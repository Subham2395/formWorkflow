import React, { useState } from "react";
import {
  DiagramComponent,
  Node,
  SymbolPaletteComponent
} from "@syncfusion/ej2-react-diagrams";
import "./workflow.scss";
import { Grid, Button } from "@material-ui/core";
import RightSidebar from '../../components/right-sidebar';
import { noop, isEmpty } from "../../utils";

//Initialize the flowshapes for the symbol palatte
let flowshapes = [
  {
    id: "AcceptingEvent",
    shape: { type: "UmlActivity", shape: "AcceptingEvent" }
  },
  { id: "SendSignal", shape: { type: "UmlActivity", shape: "SendSignal" } },
  {
    id: "ReceiveSignal",
    shape: { type: "UmlActivity", shape: "ReceiveSignal" }
  }
];
//Initializes connector symbols for the symbol palette
let connectorSymbols = [
  {
    id: "Link1",
    type: "Orthogonal",
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 40, y: 40 },
    targetDecorator: { shape: "Arrow" },
    style: { strokeWidth: 2 }
  },
  {
    id: "link2",
    type: "Orthogonal",
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 40, y: 40 },
    style: { strokeWidth: 2 },
    targetDecorator: { shape: "None" }
  },
  {
    id: "Link3",
    type: "Straight",
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 40, y: 40 },
    targetDecorator: { shape: "Arrow" },
    style: { strokeWidth: 2 }
  }
];

const SymbolPanel = () => {
  return (
    <SymbolPaletteComponent
      id="symbolpalette"
      expandMode="Multiple"
      className="symbolpalette_inner"
      palettes={[
        {
          id: "flow",
          expanded: true,
          symbols: flowshapes,
          iconCss: "e-diagram-icons1 e-diagram-flow",
          title: "Flow Shapes"
        },
        {
          id: "connectors",
          expanded: true,
          symbols: connectorSymbols,
          iconCss: "e-diagram-icons1 e-diagram-connector",
          title: "Connectors"
        }
      ]} //set default value for Node.
      getNodeDefaults={symbol => {
        if (
          symbol.id === "Terminator" ||
          symbol.id === "Process" ||
          symbol.id === "Delay"
        ) {
          symbol.width = 80;
          symbol.height = 40;
        } else if (
          symbol.id === "Decision" ||
          symbol.id === "Document" ||
          symbol.id === "PreDefinedProcess" ||
          symbol.id === "PaperTap" ||
          symbol.id === "DirectData" ||
          symbol.id === "MultiDocument" ||
          symbol.id === "Data"
        ) {
          symbol.width = 50;
          symbol.height = 40;
        } else {
          symbol.width = 50;
          symbol.height = 50;
        }
      }}
      symbolMargin={{ left: 15, right: 15, top: 15, bottom: 15 }}
      getSymbolInfo={_ => {
        return { fit: true };
      }}
      width={"100%"}
      height={"700px"}
      symbolHeight={60}
      symbolWidth={60}
    />
  );
};

//Initializes the nodes for the diagram
let nodes = [];
let interval;
interval = [
  1,
  9,
  0.25,
  9.75,
  0.25,
  9.75,
  0.25,
  9.75,
  0.25,
  9.75,
  0.25,
  9.75,
  0.25,
  9.75,
  0.25,
  9.75,
  0.25,
  9.75,
  0.25,
  9.75
];
let gridlines = {
  lineColor: "#e0e0e0",
  lineIntervals: interval
};
//Initializes the connector for the diagram
let connectors = [];

const Workflow = ({
  title,
  description,
  diagramProp = {},
  onUpdate = noop,
  history
}) => {
  let diagramInstance = null;
  const [_title, setTitle] = useState(title || "");
  const [loading, setLoadingState] = useState(false);
  const [_description, setDescription] = useState(description || "");

  const data = {
    name: _title,
    description: _description,
    diagram: diagramProp
  };

  const onUploadSuccess = ev => {
    let file1 = ev.target.files[0];
    if (file1.type === "application/json") {
      let reader = new FileReader();
      reader.readAsText(file1);
      reader.onloadend = event => {
        const result = event.target.result;
        diagramInstance.loadDiagram(
          typeof result === "string" ? JSON.parse(result) : result
        );
      };
    } else {
      alert("Invalid file format. Please upload proper diagram.json");
    }
  };

  return (
    <div className="dropSection workflow_dropSection">
      <div className="workflow_wrapper">
        <div className="left_workflow">
          <div style={{ display: "none" }}>
            <input
              type="file"
              id="insertPrevious"
              onChange={ev => onUploadSuccess(ev)}
            />
          </div>
          <div
            id="palette-space"
            className="left_wf_innerIcon sb-mobile-palette"
          >
            <SymbolPanel />
          </div>
        </div>
        {/* Diagram space component */}
        <div className="right_workflow">
          <Grid className="header_grid" container justify="space-between">
            <Grid item>
              <input
                type="text"
                placeholder="Enter workflow title"
                className="formTitle"
                value={_title}
                onChange={e => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter workflow description"
                className="formDescription"
                value={_description}
                onChange={e => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className="button bottomMargin20"
                style={{
                  marginRight: "10px",
                  color: "#ffffff",
                }}
                onClick={async ev => {
                  ev.preventDefault();
                  if (history) {
                    history.push("/workflow/new");
                  }
                }}
              >
                New
              </Button>
              <Button
                variant="contained"
                className="button bottomMargin20"
                onClick={async ev => {
                  ev.preventDefault();
                  onUpdate(
                    Object.assign(data, {
                      diagram: diagramInstance.saveDiagram()
                    })
                  );
                }}
                style={{
                  color: "#ffffff",
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
          <div id="diagram-space" className="sb-mobile-diagram">
            {loading && <div className="loader loader-circle" />}
            {!loading && (
              <DiagramComponent
                id="diagram"
                ref={diagramRef => {
                  diagramInstance = diagramRef;
                  setLoadingState(false);
                  setTimeout(() => {
                    if (
                      diagramRef &&
                      typeof diagramProp === "object" &&
                      !isEmpty(diagramProp)
                    ) {
                      diagramRef.loadDiagram(JSON.stringify(diagramProp));
                    }
                  }, 0);
                }}
                width={"100%"}
                height={"645px"}
                nodes={nodes}
                snapSettings={{
                  horizontalGridlines: gridlines,
                  verticalGridlines: gridlines
                }}
                connectors={connectors}
                getConnectorDefaults={args => {
                  args.targetDecorator.height = 5;
                  args.targetDecorator.width = 5;
                  args.style.strokeColor = "#797979";
                  args.targetDecorator.style = {
                    fill: "#797979",
                    strokeColor: "#797979"
                  };
                  return args;
                }}
                //Sets the Node style for DragEnter element.
                dragEnter={args => {
                  let obj = args.element;
                  if (obj instanceof Node) {
                    let ratio = 100 / obj.width;
                    obj.width = 100;
                    obj.height *= ratio;
                  }
                }}
              />
            )}
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Workflow;
