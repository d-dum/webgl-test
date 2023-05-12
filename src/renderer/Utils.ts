import {ContextManager} from "./ContextManager";
import {start} from "repl";


export function convertCoordsToWebgl(x_coord: number, y_coord: number, mng: ContextManager): [number, number] {
    const canvas = mng.getCanvas();
    const viewportWidth = canvas.clientWidth;
    const viewportHeight = canvas.clientHeight;

    const aspectRatio = viewportWidth / viewportHeight;

    const x = (2 * x_coord / viewportWidth) - 1;
    const y = 1 - (2 * y_coord / viewportHeight);

    return [aspectRatio * x, y];
}


export function convertCoordsFromWebgl(x: number, y: number, mng: ContextManager): [number, number] {
    const width = mng.getCanvas().width;
    const height = mng.getCanvas().height;

    const newX = (x + 1) / 2;
    const newY = (y + 1) / 2;

    const canvasX = newX * width;
    const canvasY = newY * height;

    const originalY = height - canvasY;

    return [canvasX, originalY];
}

function createCornerVertices(centerX: number, centerY: number, radius: number, numSegments: number, startAngle: number, endAngle: number): number[] {
    const vertices: number[] = [];
    const angleStep = (endAngle - startAngle) / numSegments;

    vertices.push(centerX, centerY);

    for(let i = 0; i <= numSegments; i++){
        const angle = startAngle + i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        vertices.push(x, y);
    }

    return vertices;
}

function createStraightEdgeVertices(startX: number, startY: number, endX: number, endY: number): number[] {
    return [
        startX, startY,
        endX, endY
    ]
}

export type ObjectRet = {
  vertices: number[],
  indices: number[]
};

export function createRoundedRectVertices(x: number, y: number, width: number, height: number, radius: number, numSegments: number): ObjectRet {
    const vertices: number[] = [];
    const indices: number[] = [];

    const topLeft = [x + radius, y + radius];
    const topRight = [x + width - radius, y + radius];
    const bottomLeft = [x + radius, y + height - radius];
    const bottomRight = [x + width - radius, y + height - radius];

    const tlVertices = createCornerVertices(topLeft[0], topLeft[1], radius, numSegments, Math.PI, 3 * Math.PI / 2);
    vertices.push(...tlVertices);
    const trVertices = createCornerVertices(topRight[0], topRight[1], radius, numSegments, 3 * Math.PI / 2, 2 * Math.PI);
    vertices.push(...trVertices);
    const blVertices = createCornerVertices(bottomLeft[0], bottomLeft[1], radius, numSegments, Math.PI / 2, Math.PI);
    vertices.push(...blVertices);
    const brVertices = createCornerVertices(bottomRight[0], bottomRight[1], radius, numSegments, 0, Math.PI / 2);
    vertices.push(...brVertices);
    const topVertices = createStraightEdgeVertices(topLeft[0], topLeft[1], topRight[0], topRight[1]);
    vertices.push(...topVertices);
    const bottomVertices = createStraightEdgeVertices(bottomLeft[0], bottomLeft[1], bottomRight[0], bottomRight[1]);
    vertices.push(...bottomVertices);
    const leftVertices = createStraightEdgeVertices(topLeft[0], topLeft[1], bottomLeft[0], bottomLeft[1]);
    vertices.push(...leftVertices);
    const rightVertices = createStraightEdgeVertices(topRight[0], topRight[1], bottomRight[0], bottomRight[1]);
    vertices.push(...rightVertices);

    for(let i = 0; i < vertices.length / 2; i++){
        indices.push(i);
    }

    return {
        vertices,
        indices
    }
}