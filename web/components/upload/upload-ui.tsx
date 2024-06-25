'use client';
import { ReactNode, useState } from 'react';
import { AppModal } from '../ui/ui-layout';
import { Connection } from '@solana/web3.js';

export type Attribute = {
  key: string;
  value: string;
};

export type Tag = {
  name: string;
  value: string;
};

export function FileUploadUiModal({
  hideModal,
  show,
}: {
  hideModal: () => void;
  show: boolean;
}) {
  const [name, setName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [inputTag, setInputTag] = useState<Tag>({ name: '', value: '' });
  const [loading, setLoading] = useState(false);
  async function handleUpload() {
    setLoading(true);
    const response = await fetch('/api/irys/upload/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        tags: tags,
      }),
    });

    const data = await response.json();

    console.log('response from upload/file api', data);

    setFileUrl(data.url);
    setLoading(false);
  }

  return (
    <AppModal
      title={'Upload File to Irys'}
      hide={hideModal}
      show={show}
      submit={() => {
        try {
          handleUpload();
        } catch {
          console.log('Error uploading file');
        }
      }}
      submitLabel="Upload"
    >
      <p className="text-sm text-gray-500">
        Add your file to the `./public/upload` and enter the file name below.
      </p>
      <p className="text-xs text-gray-500">
        (e.x. `./public/upload/myfile.png` ={'>'} `myfile.png`)
      </p>
      <input
        type="text"
        placeholder="File Name"
        className="input input-bordered w-full"
        value={name}
        disabled={loading}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex flex-col gap-2 justify-center items-center w-full mt-2 mb-4">
        <p className="text-sm text-gray-500">Tags</p>
        {tags.map((tag, index) => (
          <div key={index} className='flex flex-row gap-2'>
            <p className="text-xs text-gray-500">"name": {tag.name}</p>
            <p className="text-xs text-gray-500">"value": {tag.value}</p>
          </div>
        ))}
        <div className='flex flex-row gap-2'>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered"
            disabled={loading}
            onChange={(e) => setInputTag({ ...inputTag, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Value"
            className="input input-bordered"
            disabled={loading}
            onChange={(e) => setInputTag({ ...inputTag, value: e.target.value })}
          />
        </div>
        <button
          onClick={() => {
            setTags([...tags, inputTag]);
          }}
          className="btn btn-primary mb-6"
        >
          Add Tag
        </button>
      </div>
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          className="text-xl text-blue-500 underline"
        >
          View File
        </a>
      )}
    </AppModal>
  );
};

export function DataUploadUiModal({
  hideModal,
  show,
}: {
  hideModal: () => void;
  show: boolean;
}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [traitType, setTraitType] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  async function handleUpload() {
    setLoading(true);
    // create a single json object with the name, image, and attributes
    const object = {
      name: name,
      image: image,
      attributes: attributes,
    };
    const response = await fetch('/api/irys/upload/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        object: object,
      }),
    });

    const data = await response.json();

    console.log('response from upload/data api', data);

    setUrl(data.url);
    setLoading(false);
  }

  return (
    <AppModal
      title={'Upload Data to Irys'}
      hide={hideModal}
      show={show}
      submit={() => {
        try {
          handleUpload();
        } catch {
          console.log('Invalid');
        }
      }}
      submitLabel="Upload"
    >
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Image URL"
        className="input input-bordered w-full"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        disabled={loading}
      />
      {/* There should be two side by side input boxes to input attributes, when the two boxes are filled the user can click a button to 'add attribute'. the first box is the 'trait_type' and the second box is 'value'. */}
      <div className="flex flex-col gap-2 justify-center items-center w-full mt-2">
        <p className="text-sm text-gray-500">Attributes</p>
        {attributes.map((attr, index) => (
          <div key={index} className='flex flex-row gap-2'>
            <p className="text-xs text-gray-500">"trait_type": {attr.key}</p>
            <p className="text-xs text-gray-500">"value": {attr.value}</p>
          </div>
        ))}
        <div className='flex flex-row gap-2'>
          <input
            type="text"
            placeholder="Trait Type"
            className="input input-bordered"
            onChange={(e) => setTraitType(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Value"
            className="input input-bordered"
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          onClick={() => {
            setAttributes([...attributes, { key: traitType, value: value }]);
          }}
          className="btn btn-primary mb-6"
        >
          Add Attribute
        </button>
      </div>
      
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}

      {url && (
        <a
          href={url}
          target="_blank"
          className="text-xl text-blue-500 underline"
        >
          View Data
        </a>
      )}
    </AppModal>
  );
};