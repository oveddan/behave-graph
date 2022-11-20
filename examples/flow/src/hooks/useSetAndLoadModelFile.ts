import { useState, useEffect, useCallback } from 'react';
import { GraphJSON } from 'behave-graph';
import { examplePairs } from '../flowEditor/components/LoadModal';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ObjectMap } from '@react-three/fiber';

function readFileContents(file: File) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;

      if (!binaryStr) reject('no binary string');
      else resolve(binaryStr);
    };
    reader.readAsArrayBuffer(file);
  });
}

export const dataUrlFromFile = async (file: File) => {
  const fileContents = await readFileContents(file);
  if (fileContents) {
    if (typeof fileContents === 'string') {
      return fileContents;
    } else {
      const blobUrl = URL.createObjectURL(new Blob([fileContents]));

      return blobUrl;
    }
  }
};

export const publicUrl = (path: string) => new URL(path, import.meta.url).href;

export const emptyGraphJson = (): GraphJSON => ({});

export type ModelFile =
  | {
      fileUrl: string;
      fileType: 'url';
      fileContents: undefined;
    }
  | {
      fileUrl: undefined;
      fileType: 'uploaded';
      fileContents: string;
    };

export const fetchModelFile = async (url: string, fileName: string) => {
  const blob = await (await fetch(url)).blob();

  const file = new File([blob], fileName);

  return file;
};

const useSetAndLoadModelFile = () => {
  const [modelFile, setModelFileAndDataUri] = useState<{
    file: File;
    dataUri: string;
  }>();

  const [gltf, setGltf] = useState<GLTF & ObjectMap|undefined>();

  const setModelFile = useCallback (async (modelFile: File) => {
    const modelFileDataUrl = (await dataUrlFromFile(modelFile)) as string;
    setModelFileAndDataUri({ file: modelFile, dataUri: modelFileDataUrl });
  }, []);

  const setModelFileUrl = useCallback(async (fileUrl: string, fileName: string) => {
    const modelFile = await fetchModelFile(fileUrl, fileName);

    setModelFile(modelFile);
  }, [])

  useEffect(() => {
    const [defaultModelFile] = examplePairs[0];
    const modelFileUrl = publicUrl(`/examples/models/${defaultModelFile}`);

    setModelFileUrl(modelFileUrl, defaultModelFile);
  }, []);

  return {
    setModelFileUrl,
    setModelFile,
    modelFile,
    gltf,
    setGltf
  };
};

export default useSetAndLoadModelFile;