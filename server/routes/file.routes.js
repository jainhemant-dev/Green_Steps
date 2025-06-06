import * as fileController from '##/server/controllers/file.controller.js';
import { isAllowed } from '##/server/policies/api.policies.js';
import { withAsyncErrorHandling } from '##/server/utility/utility.js';

export default function routes(app) {
  app
    .route('/api/files')
    .all(isAllowed)
    .put(withAsyncErrorHandling(fileController.handleS3FileUploadSignedUrl))
    .delete(withAsyncErrorHandling(fileController.handleS3FileDeleteSignedUrl));
}
