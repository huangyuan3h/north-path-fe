import clsx from 'clsx';
import { RCIC } from '../types';
import { Badge } from 'react-bootstrap';

export interface IProfile {
  rcic: RCIC | null;
}

export const ShowProfile: React.FC<IProfile> = ({ rcic }: IProfile) => {
  if (!rcic) {
    return <></>;
  }

  const isActive = rcic.form_membership_status_text === 'Active';

  return (
    <div className="container mt-4 border rounded p-4">
      <div className="flex flex-col gap-y-2">
        <h5>登记信息</h5>
        <div className="row">
          <div className="col-md-6 mt-2">
            <div>
              <label>姓名:</label>
              <span className="ml-2">{`${rcic.step1_given_name}, ${rcic.step1_surname}`}</span>
            </div>
            <small className="form-text text-muted">
              英文一般名在前姓在后，一定要与合同上一致
            </small>
          </div>
          <div className="col-md-6 mt-2">
            <div>
              <label>RCIC 编号:</label>
              <span className="ml-2">{rcic.form_consultant_id}</span>
            </div>
            <small className="form-text text-muted">
              RCIC唯一编号，一定要与合同上一致
            </small>
          </div>
        </div>
        <div className="form-group mt-2">
          <div>
            <label>当前状态:</label>
            <Badge className="ml-2 p-1" bg={isActive ? 'primary' : 'danger'}>
              {rcic.form_membership_status_text}
            </Badge>
          </div>

          {!isActive && (
            <>
              <div>
                <label>处罚时间:</label>
                <span className="ml-2">{rcic.form_date_status_changed}</span>
              </div>
              {rcic.form_reason_text && (
                <div>
                  <label>处罚理由:</label>
                  <span className="ml-2">
                    {rcic.form_reason_text.replace('\\r\\n', ',')}
                  </span>
                </div>
              )}
            </>
          )}

          <small className="form-text text-muted">
            假如不是“Active”,
            意味着没合法的资格帮你递签，而市场上持牌非常多，直接拉黑！
          </small>
        </div>
        <div className="form-group mt-2">
          <label>历史公司信息:</label>
          {rcic.companies.toReversed().map((c: string) => (
            <div key={`company-${c}`}>{c}</div>
          ))}
          <small className="form-text text-muted">
            这位顾问任职过的所有公司, 签约文件中的公司信息必须与第一项一致！
          </small>
        </div>
        <hr />
        <h5>地址信息</h5>
        <div className="col-md-6 mt-2">
          <label>地址:</label>
          <div>{rcic.address}</div>
          <div>{`${rcic.city}, ${rcic.state}, ${rcic.country}`}</div>
        </div>
        <div className="col-md-6 mt-2">
          <div>
            <label>邮编:</label>
            <span className="ml-2">{rcic.postal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
