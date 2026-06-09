import React, { useEffect, useRef, useState } from 'react';
import { FileText, CheckCircle2, Upload, Archive, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useRoleView } from '../../context/RoleViewContext';

interface ContractItem {
  id: string;
  title: string;
  counterparty: string;
  amount: string;
  status: 'Draft' | 'In Review' | 'Signed';
  updated: string;
}

const initialContracts: ContractItem[] = [
  {
    id: 'doc-1',
    title: 'Seed Investment Term Sheet',
    counterparty: 'Nova Ventures',
    amount: '$325,000',
    status: 'In Review',
    updated: 'Today',
  },
  {
    id: 'doc-2',
    title: 'Sales Partnership Agreement',
    counterparty: 'LaunchBridge',
    amount: '$80,000',
    status: 'Draft',
    updated: 'Yesterday',
  },
  {
    id: 'doc-3',
    title: 'Convertible Note',
    counterparty: 'Futura Capital',
    amount: '$200,000',
    status: 'Signed',
    updated: '2 days ago',
  },
];

export const DocumentChamberPage: React.FC = () => {
  const { user } = useAuth();
  const { viewMode, setViewMode } = useRoleView();
  const [contracts, setContracts] = useState<ContractItem[]>(initialContracts);
  const [selectedContractId, setSelectedContractId] = useState(initialContracts[0].id);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedContract = contracts.find(contract => contract.id === selectedContractId) ?? initialContracts[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    const context = canvas.getContext('2d');
    if (context) {
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.lineWidth = 3;
      context.strokeStyle = '#1F2937';
    }
  }, []);

  const getCursorPosition = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const context = canvas.getContext('2d');
    if (!context) return;
    const { x, y } = getCursorPosition(event);
    context.beginPath();
    context.moveTo(x, y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const { x, y } = getCursorPosition(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSigned(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSign = () => {
    if (!hasSigned) return;
    setContracts(prev =>
      prev.map(contract =>
        contract.id === selectedContractId ? { ...contract, status: 'Signed' } : contract
      )
    );
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700">
            <FileText size={18} /> Document Chamber
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Contract Processing & Signature Center</h1>
          <p className="text-gray-600">Review deal paperwork, examine contract statuses, and sign agreements in one secure UI.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="accent">View mode: {viewMode}</Badge>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'investor' ? 'entrepreneur' : 'investor')}>
            Switch to {viewMode === 'investor' ? 'Entrepreneur' : 'Investor'} View
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Active contracts</h2>
              <p className="text-sm text-gray-600">Track status badges across drafts, reviews, and signed agreements.</p>
            </div>
            <Badge variant="gray">{viewMode === 'investor' ? 'Investor workflow' : 'Entrepreneur workflow'}</Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4">
              {contracts.map(contract => (
                <div key={contract.id} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{contract.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{contract.counterparty} • {contract.amount}</p>
                    </div>
                    <Badge variant={contract.status === 'Signed' ? 'success' : contract.status === 'In Review' ? 'warning' : 'error'} rounded>
                      {contract.status}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                    <span>Last update: {contract.updated}</span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedContractId(contract.id)}>
                      {selectedContractId === contract.id ? 'Selected' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Contract preview</h2>
            </CardHeader>
            <CardBody>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{selectedContract.title}</p>
                    <p className="mt-1 text-sm text-gray-500">Counterparty: {selectedContract.counterparty}</p>
                  </div>
                  <Badge variant={selectedContract.status === 'Signed' ? 'success' : selectedContract.status === 'In Review' ? 'warning' : 'error'}>
                    {selectedContract.status}
                  </Badge>
                </div>
                <div className="mt-6 h-52 rounded-3xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-500">
                  <div className="flex h-full flex-col justify-center items-center gap-3 text-center">
                    <Upload size={36} className="text-gray-300" />
                    <p>PDF preview frame placeholder</p>
                    <p>Signed contracts and uploads will appear here.</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Signature pad</h2>
            </CardHeader>
            <CardBody>
              <div className="rounded-3xl border border-gray-200 bg-white p-4">
                <div className="h-52 overflow-hidden rounded-3xl border border-gray-300 bg-slate-50">
                  <canvas
                    ref={canvasRef}
                    className="h-full w-full"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={clearSignature} leftIcon={<XCircle size={16} />}>
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSign}
                    leftIcon={<CheckCircle2 size={16} />}
                    disabled={!hasSigned}
                  >
                    Sign contract
                  </Button>
                </div>
                {hasSigned && (
                  <p className="mt-3 text-sm text-success-700">Signature brush captured. Click sign to mark this contract as Signed.</p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
