# Venture 3D Studio — Table Time

A free browser-based design studio at `/Mission-2/studio/`. The prebuilt camera, mount and phone are a stylized procedural interpretation of the supplied concept image. This is not automatic image-to-3D reconstruction, CAD, or a camera sensing implementation.

## Student guide
1. Drag to orbit, scroll/pinch to zoom, and right-drag/two-finger drag to pan. Pan mode also lets the left mouse drag pan. Choose Front, Side, Top, Isometric, Fit model, or Orthographic.
2. Select a part from the scene list or canvas. Use Move, Rotate or Resize handles, or numerical fields. Project units are approximate centimeters. Bounds include rotation.
3. Change color, roughness, metallic appearance, opacity, or a material preset. Apply an image to a primitive; repeat and offset controls adjust wrapping. Use a thin box as a flat decal. Imported GLBs are grouped parts and retain their original materials unless overridden; use project.json for original component-level editing.
4. Import references, describe the design, and label front/side/back views. Uploaded images remain references; they do not generate geometry automatically. Eight editable starting models include the Table Time concept and seven generic templates. Opening a template retains the previous project in recovery and Undo.
5. Autosave uses IndexedDB. Save project creates a manual restore point. Backup downloads a self-contained editable JSON with references and textures. Import that JSON on another device. Browser data can be cleared; keep a backup.
6. Frame your product, click Confirm Model, and save `Venture_3D_Confirmed_Handoff.zip`. Confirmation exports real geometry, reimports it with GLTFLoader, verifies mesh presence, embeds image textures, hashes the GLB, saves the confirmed snapshot separately, and packages five files. It does not publish a website. Editing afterwards requires a new confirmation.
7. Carry the entire ZIP into the next website-integration mission. The independent `/studio/viewer.html` page can open its model.glb without the editor.

## Handoff schema v1
`model-manifest.json` schemaVersion is `venture-3d-handoff/1`.
- projectName, modelName, modelType, confirmedAt (ISO UTC)
- dimensions.size: axis-aligned [width,height,depth] in dimensions.units (`cm`); metersPerUnit=.01
- coordinateSystem: right-handed Y-up. The GLB root converts editable centimeters to glTF meters.
- camera.position and camera.target: editable scene coordinates in cm; projection: perspective/orthographic. Divide positions by 100 when viewing the GLB in meters.
- background: hex color; lighting: selected preset; description and optional featureHotspots: plain text
- files: relative model, project, preview, readme names; modelSha256: lowercase SHA-256 of exact model.glb bytes
ZIP files: model.glb, model-manifest.json, project.json, preview.png, README.txt.
`project.json` schemaVersion is `venture-3d-project/1`: editable objects with id/name/shape/pos/rot/scale/size/material fields; angles in degrees; assets contain embedded data URLs; references are embedded in portable exports.

## Build and limitations
`npm ci`, `npm run build`. Vite base is relative, compatible with the existing GitHub Pages subpath. Root deployment builds studio then copies studio/dist; dashboard/laboratory remain intact. No runtime backend, API keys or paid services. Google font loading is optional; system fonts fall back.

The studio is optimized for laptop/desktop. Mobile has a stacked layout and touch orbit/pan; fine gizmo edits are easier with a mouse. Images ≤20MB and 8192px per side; project import ≤30MB; scene ≤300 components. Texture wrapping uses primitive UVs, not a painting/unwrapping tool. Room, bag and mascot templates are intentionally simplified. Transparent surfaces use standard alpha blending. No manufacturing accuracy, camera functionality, or app telemetry is implied.
