import { PostAPI } from './request';

export const GetPendingData = async () => {
  return await PostAPI({ url: '/icp/auto/robot/domain-one' });
};

export const UploadPendingData = async (data) => {
  return await PostAPI({ url: '/icp/auto/robot/domain-one-save', data });
};
