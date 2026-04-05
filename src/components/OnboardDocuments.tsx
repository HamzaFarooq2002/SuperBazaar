import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { ArrowLeft, Upload, FileText, CheckCircle2 } from 'lucide-react';
import svgPaths from "../imports/svg-2pthmw0ane";
import imgRectangle4 from "figma:asset/a9f37960141116dc132cdcd04169283a98871cc6.png";

function StatusBar() {
  return (
    <div className="absolute h-[44px] left-0 overflow-clip top-0 w-full z-10">
      <div className="absolute h-[11.336px] right-[14.67px] top-[17.33px] w-[66.661px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 12">
          <g>
            <g>
              <path d={svgPaths.p284dc240} opacity="0.35" stroke="var(--stroke-0, black)" />
              <path d={svgPaths.p3b01f0e0} fill="var(--fill-0, black)" opacity="0.4" />
              <path d={svgPaths.p11b4bf10} fill="var(--fill-0, black)" />
            </g>
            <path d={svgPaths.pc434800} fill="var(--fill-0, black)" />
            <path d={svgPaths.p28a9ed00} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <div className="absolute h-[21px] left-[21px] top-[12px] w-[54px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 21">
          <g>
            <g>
              <path d={svgPaths.p24372f50} fill="var(--fill-0, black)" />
              <path d={svgPaths.p3aa84e00} fill="var(--fill-0, black)" />
              <path d={svgPaths.p2e6b3780} fill="var(--fill-0, black)" />
              <path d={svgPaths.p12b0b900} fill="var(--fill-0, black)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

type DocumentType = 'ntn' | 'registration' | 'bank';

export function OnboardDocuments() {
  const { navigateTo } = useContext(AppContext);
  const { refreshUser } = useAuth();
  const [uploadedDocs, setUploadedDocs] = useState<Set<DocumentType>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const documents = [
    {
      id: 'ntn' as DocumentType,
      title: 'NTN Certificate',
      description: 'National Tax Number certificate',
      required: true
    },
    {
      id: 'registration' as DocumentType,
      title: 'Business Registration',
      description: 'Certificate of incorporation or registration',
      required: true
    },
    {
      id: 'bank' as DocumentType,
      title: 'Bank Statement',
      description: 'Past 6 months bank statements',
      required: true
    }
  ];

  const handleUpload = (docId: DocumentType) => {
    const newUploaded = new Set(uploadedDocs);
    newUploaded.add(docId);
    setUploadedDocs(newUploaded);
  };

  const allUploaded = documents.every(doc => uploadedDocs.has(doc.id));

  const docTypeMap: Record<DocumentType, string> = {
    ntn: 'ntn_certificate',
    registration: 'business_registration',
    bank: 'bank_statement'
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      <StatusBar />

      {/* Progress Bar */}
      <div className="absolute bg-[#f6f6f6] h-[61px] left-0 top-[49px] w-full">
        <div className="flex items-center justify-between px-4 pt-5">
          <p className="text-[12px] text-black opacity-60 tracking-[-0.12px]">
            Step 6 of 7 • Documents
          </p>
          <div className="bg-[#e1f4e3] h-[22px] rounded-[21px] px-3 flex items-center gap-1">
            <div className="w-4 h-3 overflow-hidden">
              <img alt="" className="w-full h-full object-cover" src={imgRectangle4} />
            </div>
            <span className="text-[#38a829] text-[11px] font-extralight tracking-[-0.11px]">75%</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigateTo('onboard-biometric')}
        className="absolute left-6 top-[140px] z-20"
      >
        <ArrowLeft className="w-6 h-6 text-black" />
      </button>

      {/* Content */}
      <div className="pt-[180px] px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-[24px] text-black tracking-[-0.24px] mb-2">Upload Documents</h2>
          <p className="text-[16px] text-black opacity-40 leading-relaxed">
            We need these documents to verify your business
          </p>
        </motion.div>

        {/* Document Upload Cards */}
        <div className="space-y-4 mb-8">
          {documents.map((doc, index) => {
            const isUploaded = uploadedDocs.has(doc.id);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`relative rounded-[10px] border-2 p-4 transition-all ${
                  isUploaded 
                    ? 'border-[#3D8A75] bg-[#e1f4e3]' 
                    : 'border-[#e0e0e0] bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                    isUploaded ? 'bg-[#3D8A75]' : 'bg-[#f6f6f6]'
                  }`}>
                    {isUploaded ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <FileText className="w-6 h-6 text-[#102542]" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[15px] text-black font-medium">{doc.title}</p>
                      {doc.required && !isUploaded && (
                        <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-black opacity-60 mb-3">
                      {doc.description}
                    </p>
                    
                    {!isUploaded && (
                      <button
                        onClick={() => handleUpload(doc.id)}
                        className="flex items-center gap-2 text-[13px] text-[#3D8A75] font-medium hover:text-[#2d6b5c] transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload File
                      </button>
                    )}
                    
                    {isUploaded && (
                      <p className="text-[12px] text-[#3D8A75] font-medium">
                        ✓ Uploaded successfully
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#f6f6f6] rounded-[10px] p-4 mb-6"
        >
          <p className="text-[12px] text-black opacity-60 leading-relaxed">
            <span className="font-semibold">📄 Accepted formats:</span> PDF, JPG, PNG (Max 5MB per file)
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={async () => {
            if (!allUploaded) return;
            setLoading(true);
            setError('');
            try {
              const kycDocs = Array.from(uploadedDocs).map((doc) => ({ type: docTypeMap[doc] }));
              await api.auth.submitKYC({ documents: kycDocs });
              await refreshUser();
              navigateTo('onboard-congratulations');
            } catch (err: any) {
              setError(err?.error?.message || 'Unable to submit documents');
            } finally {
              setLoading(false);
            }
          }}
          disabled={!allUploaded || loading}
          className={`w-full h-[43px] rounded-[10px] text-white font-medium text-[15px] tracking-[0.6px] transition-all ${
            allUploaded && !loading
              ? 'bg-[#3D8A75] hover:bg-[#2d6b5c]' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {loading ? 'Submitting...' : 'Continue'}
        </motion.button>

        {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}

        <button
          onClick={async () => {
            setLoading(true);
            setError('');
            try {
              await api.auth.submitKYC({ documents: [] });
              await refreshUser();
              navigateTo('onboard-congratulations');
            } catch (err: any) {
              setError(err?.error?.message || 'Unable to skip documents');
            } finally {
              setLoading(false);
            }
          }}
          className="w-full mt-4 text-[14px] text-black opacity-60 hover:opacity-100 transition-opacity"
        >
          Skip for now
        </button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-full">
        <div className="absolute bg-black bottom-[8px] h-[5px] left-1/2 rounded-[100px] translate-x-[-50%] w-[134px]" />
      </div>
    </div>
  );
}
