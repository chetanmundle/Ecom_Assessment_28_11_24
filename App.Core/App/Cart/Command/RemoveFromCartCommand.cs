using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Cart.Command
{
    public class RemoveFromCartCommand : IRequest<AppResponse>
    {
        public int CartDetailsId { get; set; }

    }

    internal class RemoveFromCartCommandHandler : IRequestHandler<RemoveFromCartCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public RemoveFromCartCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
        {
            var CartDetailsId = request.CartDetailsId;

            var cartDetail = await _appDbContext.Set<Domain.Entities.CartDetails>()
                            .FirstOrDefaultAsync(cd => cd.CartDetailsId == CartDetailsId, cancellationToken);

            if (cartDetail is null) return AppResponse.Response(false, "Data with this id Not Found..!", HttpStatusCodes.NotFound);

            _appDbContext.Set<Domain.Entities.CartDetails>()
                   .Remove(cartDetail);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true, "Item Remove Successfully", HttpStatusCodes.OK);
        }
    }
}
