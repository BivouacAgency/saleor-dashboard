import { makeStyles, Typography } from "@material-ui/core";
import DefaultCardTitle from "@saleor/components/CardTitle";
import { StatusType } from "@saleor/components/StatusChip/types";
import StatusLabel from "@saleor/components/StatusLabel";
import {
  OrderDetails_order_fulfillments,
  OrderDetails_order_fulfillments_lines,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import { FulfillmentStatus } from "@saleor/types/globalTypes";
import camelCase from "lodash/camelCase";
import React from "react";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    orderNumber: {
      display: "inline",
      marginLeft: theme.spacing(1)
    }
  }),
  { name: "CardTitle" }
);

const messages = defineMessages({
  cancelled: {
    defaultMessage: "Cancelled ({quantity})",
    description: "cancelled fulfillment, section header"
  },
  fulfilled: {
    defaultMessage: "Fulfilled ({quantity})",
    description: "section header"
  },
  refunded: {
    defaultMessage: "Refunded ({quantity})",
    description: "refunded fulfillment, section header"
  },
  refunedAndReturned: {
    defaultMessage: "Cancelled ({quantity})",
    description: "cancelled fulfillment, section header"
  },
  returned: {
    defaultMessage: "Returned ({quantity})",
    description: "refunded fulfillment, section header"
  },
  unfulfilled: {
    defaultMessage: "Unfulfilled",
    description: "section header"
  }
});

interface CardTitleProps {
  lines?: OrderDetails_order_lines[] | OrderDetails_order_fulfillments_lines[];
  fulfillment?: OrderDetails_order_fulfillments;
  toolbar?: React.ReactNode;
  orderNumber?: string;
  withStatus?: boolean;
}

const selectStatus = (status: FulfillmentStatus) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      return StatusType.SUCCESS;
    case FulfillmentStatus.REFUNDED:
      return StatusType.SUCCESS;
    case FulfillmentStatus.RETURNED:
      return StatusType.NEUTRAL;
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      return StatusType.SUCCESS;
    case FulfillmentStatus.CANCELED:
      return StatusType.ERROR;
    default:
      return StatusType.NEUTRAL;
  }
};

const CardTitle: React.FC<CardTitleProps> = ({
  lines = [],
  fulfillment,
  orderNumber = "",
  withStatus = false,
  toolbar
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const fulfillmentName = fulfillment
    ? `#${orderNumber}-${fulfillment?.fulfillmentOrder}`
    : "";

  const messageForStatus =
    messages[camelCase(fulfillment?.status)] || messages.unfulfilled;

  const totalQuantity = lines.reduce(
    (resultQuantity, { quantity }) => resultQuantity + quantity,
    0
  );

  const title = (
    <>
      {intl.formatMessage(messageForStatus, {
        fulfillmentName,
        quantity: totalQuantity
      })}
      <Typography className={classes.orderNumber} variant="body1">
        {fulfillmentName}
      </Typography>
    </>
  );

  return (
    <DefaultCardTitle
      toolbar={toolbar}
      title={
        withStatus ? (
          <StatusLabel
            label={title}
            status={selectStatus(fulfillment?.status)}
          />
        ) : (
          title
        )
      }
    />
  );
};

export default CardTitle;
